import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { fileService } from "../services/fileService";
import { File as FileType } from "../types/file";
import { formatBytes } from "../utils/format"; 

type Props = { params?: Record<string, any> };

export const FileList: React.FC<Props> = ({ params = {} }) => {
  const qc = useQueryClient();

  const { data: files, isLoading, error } = useQuery<FileType[]>({
    queryKey: ["files", params],
    queryFn: () => fileService.getFiles(params),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fileService.deleteFile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      qc.invalidateQueries({ queryKey: ["savings"] });
    },
  });

  const downloadMutation = useMutation({
    // --- THIS IS THE CHANGE ---
    // Change the props to fileId and filename
    mutationFn: ({ fileId, filename }: { fileId: string; filename: string }) =>
      fileService.downloadFile(fileId, filename),
    // --- END OF CHANGE ---
  });

  if (isLoading) {
    // ... (no change here)
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    // ... (no change here)
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">Couldn’t load files. Try again.</p>
        </div>
      </div>
    );
  }

  const rows = files ?? [];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Files</h2>

      {rows.length === 0 ? (
        // ... (no change here)
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
          <p className="mt-1 text-sm text-gray-500">Upload something or tweak filters.</p>
        </div>
      ) : (
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200">
            {rows.map((file) => (
              <li key={file.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.original_filename}</p>
                    <p className="text-sm text-gray-500">
                      {file.file_type} • {formatBytes(file.size)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(file.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      // --- THIS IS THE CHANGE ---
                      // Pass file.id instead of file.file
                      onClick={() =>
                        downloadMutation.mutate({ fileId: file.id, filename: file.original_filename })
                      }
                      disabled={downloadMutation.isPending}
                      // --- END OF CHANGE ---
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(String(file.id))}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};