import React, { useState, useEffect, useCallback } from "react";
import type { FileFilters } from "../services/fileService";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Add a debounce hook for the search input
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

type Props = {
  value: FileFilters;
  onChange: (next: FileFilters) => void;
  fileTypes: string[];
};

export default function Filters({ value, onChange, fileTypes }: Props) {
  const [localSearch, setLocalSearch] = useState(value.search || "");
  const debouncedSearch = useDebounce(localSearch, 300);

  // FIX: Wrap 'set' in useCallback to stabilize it
  const set = useCallback((patch: Partial<FileFilters>) => {
    // Remove 'undefined' or 'null' values
    const cleanedPatch = Object.entries(patch).reduce((acc, [key, val]) => {
      if (val !== null && val !== undefined) {
        // FIX: Explicitly cast 'key' to satisfy TypeScript
        (acc as Partial<FileFilters>)[key as keyof FileFilters] = val;
      }
      return acc;
    }, {} as Partial<FileFilters>);

    onChange({ ...value, ...cleanedPatch });
  }, [onChange, value]);

  // Update the parent state only when the debounced value changes
  useEffect(() => {
    // We check debouncedSearch to avoid firing on initial load
    if (debouncedSearch) {
      set({ search: debouncedSearch });
    }
    // FIX: Add 'set' to the dependency array to satisfy ESLint
  }, [debouncedSearch, set]);
  
  const clearFilters = () => {
    setLocalSearch("");
    onChange({}); // Reset to an empty object
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          placeholder="Search filename…"
          className="border rounded px-3 py-2 text-sm"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2 text-sm"
          value={value.file_type || ""}
          onChange={(e) => set({ file_type: e.target.value || undefined })}
        >
          <option value="">All types</option>
          {fileTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={value.ordering || "-uploaded_at"}
          onChange={(e) => set({ ordering: e.target.value })}
        >
          <option value="-uploaded_at">Newest</option>
          <option value="uploaded_at">Oldest</option>
          <option value="original_filename">Name A→Z</option>
          <option value="-original_filename">Name Z→A</option>
          <option value="-size">Size (High-Low)</option>
          <option value="size">Size (Low-High)</option>
        </select>

        <span className="text-sm text-gray-500">Size:</span>
        <input
          type="number"
          placeholder="Min bytes"
          className="border rounded px-3 py-2 text-sm w-28"
          value={value.size__gte || ""}
          onChange={(e) => set({ size__gte: e.target.value || undefined })}
        />
        <input
          type="number"
          placeholder="Max bytes"
          className="border rounded px-3 py-2 text-sm w-28"
          value={value.size__lte || ""}
          onChange={(e) => set({ size__lte: e.target.value || undefined })}
        />

        <span className="text-sm text-gray-500">Date:</span>
        <input
          type="date"
          className="border rounded px-3 py-2 text-sm"
          value={value.uploaded_at__date__gte || ""}
          onChange={(e) => set({ uploaded_at__date__gte: e.target.value || undefined })}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 text-sm"
          value={value.uploaded_at__date__lte || ""}
          onChange={(e) => set({ uploaded_at__date__lte: e.target.value || undefined })}
        />
        
        <button 
          onClick={clearFilters} 
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <XMarkIcon className="h-4 w-4 mr-1" />
          Clear
        </button>
      </div>
    </div>
  );
}