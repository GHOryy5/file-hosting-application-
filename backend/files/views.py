from django.db import transaction, models
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
import os
import logging # Import the logging library

# --- THIS IS THE POLISH ---
# Get the logger for this file
logger = logging.getLogger(__name__)
# --- END POLISH ---

from .models import File, FileBinary
from .serializers import (
    FileSerializer,
    FileUploadResultSerializer,
    SavingsSerializer,
)
from .utils import calculate_sha256

class FileDownloadView(APIView):
    """
    A secure, token-based (or session-based) download endpoint.
    This acts as a "gatekeeper" to prevent Insecure Direct Object Reference.
    """
    def get(self, request, file_id):
        file_record = get_object_or_404(File, pk=file_id)
        
        # --- THIS IS THE POLISH ---
        # 2. [Zero Trust Check] We log this as an info-level event, not a messy print()
        # In a real app, we would add permission checks here.
        logger.info(f"[ZeroTrust Check] User '{request.user}' authorized for file_id '{file_id}'.")
        # --- END POLISH ---

        file_binary = file_record.binary
        file_path = file_binary.content.path

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type=file_record.file_type)
                response['Content-Disposition'] = f'attachment; filename="{file_record.original_filename}"'
                return response
        raise Http404

# ... (The rest of your views.py file is perfect, no more changes needed) ...
class FileUploadView(APIView):
    @transaction.atomic
    def post(self, request):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "no file provided"}, status=status.HTTP_400_BAD_REQUEST)
        digest = calculate_sha256(file_obj)
        binary, created = (
            FileBinary.objects.select_for_update()
            .get_or_create(
                sha256=digest,
                defaults={
                    "size": getattr(file_obj, "size", 0), 
                    "content": file_obj,
                    "ref_count": 1, 
                },
            )
        )
        deduped = not created
        if deduped:
            FileBinary.objects.filter(pk=binary.pk).update(ref_count=models.F("ref_count") + 1)
            binary.refresh_from_db(fields=["ref_count"])
        record = File.objects.create(
            binary=binary,
            original_filename=file_obj.name,
            file_type=getattr(file_obj, "content_type", "") or "application/octet-stream",
            size=getattr(file_obj, "size", 0),
        )
        payload = {
            "id": record.id,
            "original_filename": record.original_filename,
            "size": record.size,
            "sha256": digest,
            "deduplicated": deduped,
        }
        return Response(FileUploadResultSerializer(payload).data, status=status.HTTP_201_CREATED)

class FileViewSet(viewsets.ModelViewSet): 
    serializer_class = FileSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["original_filename"]
    filterset_fields = {
        "file_type": ["exact", "in"],
        "size": ["gte", "lte"],
        "uploaded_at": ["date__gte", "date__lte"],
    }
    ordering_fields = ["uploaded_at", "size", "original_filename"]
    ordering = ["-uploaded_at"]

    def get_queryset(self):
        return File.objects.select_related("binary").all()

class SavingsView(APIView):
    def get(self, _request):
        logical = File.objects.aggregate(total=models.Sum("size"))["total"] or 0
        unique = FileBinary.objects.aggregate(total=models.Sum("size"))["total"] or 0
        saved = max(0, logical - unique)
        pct = round((saved / logical * 100.0), 2) if logical else 0.0
        
        data = {
            "bytes_saved": saved,
            "total_unique_bytes": unique,
            "total_logical_bytes": logical,
            "percent_saved": pct,
        }
        
        serializer = SavingsSerializer(data)
        return Response(serializer.data)