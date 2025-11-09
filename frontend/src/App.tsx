import React from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Filters from "./components/Filters";
import { fileService, type FileFilters } from "./services/fileService";
import { FileList } from "./components/FileList";
import FileUpload from "./components/FileUpload";
import SavingsBadge from "./components/SavingsBadge";

const qc = new QueryClient();

function AppInner() {
  const queryClient = useQueryClient();

  // 💡 FIX: The filter state keys MUST match the API query params
  // (e.g., 'size__gte', not 'size_gte')
  const [filters, setFilters] = React.useState<FileFilters>({
    search: undefined,
    file_type: undefined,
    size__gte: undefined,
    size__lte: undefined,
    uploaded_at__date__gte: undefined,
    uploaded_at__date__lte: undefined,
    ordering: "-uploaded_at",
  });

  // 💡 FIX: This component does not need to fetch files.
  // We will pass the 'filters' object to FileList,
  // and FileList will fetch the data itself.
  // (Removed the redundant filesQuery)

  const savingsQuery = useQuery({
    queryKey: ["savings"],
    queryFn: fileService.getSavings,
  });

  const uploadMutation = useMutation({
    mutationFn: (form: FormData) => fileService.upload(form),
    onSuccess: () => {
      // Invalidate both queries on a successful upload
      queryClient.invalidateQueries({ queryKey: ["files"] });
      queryClient.invalidateQueries({ queryKey: ["savings"] });
    },
  });

  // This is fine, or it could be fetched from the API
  const fileTypes = ["application/pdf", "text/plain", "image/png", "image/jpeg", "application/zip"];

  return (
    // 💡 UI POLISH: Add a background and max-width container
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Abnormal File Vault</h1>
          {savingsQuery.data && <SavingsBadge savings={savingsQuery.data} />}
        </div>

        {/* 💡 UI POLISH: Wrap the main app in a "card" */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <FileUpload onUpload={(form) => uploadMutation.mutate(form)} isLoading={uploadMutation.isPending} />

          <Filters value={filters} onChange={setFilters} fileTypes={fileTypes} />

          {/* 💡 FIX: Pass the 'filters' state as the 'params' prop.
            Now FileList will re-fetch whenever 'filters' changes.
          */}
          <FileList params={filters} />
        </div>

        {/* 💡 FIX: This error is no longer needed, FileList handles it. */}

      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppInner />
    </QueryClientProvider>
  );
}