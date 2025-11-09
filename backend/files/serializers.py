from rest_framework import serializers
from .models import File, FileBinary


class FileSerializer(serializers.ModelSerializer):
    """
    Serializer for listing and retrieving File metadata.
    """
    # Explicitly define id to ensure it's treated as an integer
    id = serializers.IntegerField(read_only=True)
    file = serializers.FileField(source="binary.content", read_only=True)
    sha256 = serializers.CharField(source="binary.sha256", read_only=True)
    
    class Meta:
        model = File
        fields = [
            "id",
            "original_filename",
            "file_type",
            "size",
            "uploaded_at",
            "file",
            "sha256",
        ]


class FileUploadResultSerializer(serializers.Serializer):
    """
    Custom serializer for the response after a file upload.
    """
    id = serializers.IntegerField()
    original_filename = serializers.CharField()
    size = serializers.IntegerField()
    sha256 = serializers.CharField()
    deduplicated = serializers.BooleanField()


class SavingsSerializer(serializers.Serializer):
    """
    Custom serializer for the storage savings endpoint.
    """
    bytes_saved = serializers.IntegerField()
    total_unique_bytes = serializers.IntegerField()
    total_logical_bytes = serializers.IntegerField()
    percent_saved = serializers.FloatField()