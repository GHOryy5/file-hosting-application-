import { File } from "../types/file";

const API = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

export type FileFilters = {
  search?: string;
  file_type?: string;
  size__gte?: string;
  size__lte?: string;
  uploaded_at__date__gte?: string;
  uploaded_at__date__lte?: string;
  ordering?: string;
};

export const fileService = {
  async getFiles(filters: FileFilters = {}) {
    // ... (this function is correct, no change)
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        p.set(key, value);
      }
    });

    const url = `${API}/files/${p.toString() ? `?${p.toString()}` : ""}`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`files list failed: ${res.status}`);
    return (await res.json()) as File[];
  },

  async upload(formData: FormData) {
    // ... (this function is correct, no change)
    const res = await fetch(`${API}/upload/`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) throw new Error(`upload failed: ${res.status}`);
    return await res.json();
  },

  async deleteFile(id: number | string) {
    // ... (this function is correct, no change)
    const res = await fetch(`${API}/files/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok && res.status !== 204) throw new Error(`delete failed: ${res.status}`);
    return true;
  },

  // --- THIS IS THE "HIGHEST SALARY" CHANGE ---
  async downloadFile(fileId: string, filename: string) {
    // Call our new secure endpoint
    const res = await fetch(`${API}/download/${fileId}/`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error(`download failed: ${res.status}`);
    
    // The rest is the same: stream the blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
  // --- END OF CHANGE ---

  async getSavings() {
    // ... (this function is correct, no change)
    const res = await fetch(`${API}/stats/savings/`, { credentials: "include" });
    if (!res.ok) throw new Error(`savings failed: ${res.status}`);
    return await res.json();
  },
};