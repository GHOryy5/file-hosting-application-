from django.db import models
from django.utils import timezone
import os

def upload_path(instance, filename):
    prefix = (instance.sha256 or "nohash")[:2]
    base, ext = os.path.splitext(filename)
    safe_ext = ext if ext else ""
    return f"files/{prefix}/{instance.sha256}{safe_ext}"

class FileBinary(models.Model):
    # FIX: This must be BigAutoField
    id = models.BigAutoField(primary_key=True)
    sha256 = models.CharField(max_length=64, unique=True, db_index=True)
    size = models.BigIntegerField(default=0)
    content = models.FileField(upload_to=upload_path)
    ref_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.sha256

class File(models.Model):
    # FIX: This must be BigAutoField
    id = models.BigAutoField(primary_key=True)
    binary = models.ForeignKey(FileBinary, on_delete=models.PROTECT, related_name="files")
    original_filename = models.CharField(max_length=255, db_index=True)
    file_type = models.CharField(max_length=255, db_index=True)
    size = models.BigIntegerField(default=0)
    uploaded_at = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=["uploaded_at"]),
            models.Index(fields=["size"]),
        ]
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.original_filename