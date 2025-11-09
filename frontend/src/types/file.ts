export type File = {
  id: string;
  original_filename: string;
  file_type: string;
  size: number; // bytes
  uploaded_at: string; // ISO
  
  // FIX: Change 'download_url' to 'file' and add 'sha256'
  // This must match the 'FileSerializer' in backend/file/serializers.py
  file: string; 
  sha256: string;
};