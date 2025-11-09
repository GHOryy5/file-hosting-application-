import React, { useRef } from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  onUpload: (form: FormData) => void;
  isLoading?: boolean;
};

const FileUpload: React.FC<Props> = ({ onUpload, isLoading }) => {
  const [file, setFile] = React.useState<File | null>(null);
  
  // 💡 SUGGESTION: Add a ref to the input
  // This allows us to clear its value after submit
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    onUpload(form);

    // 💡 UX FIX: Clear the file state and the input value
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="flex-1">
        {/* 💡 UI POLISH: Use a styled <label> for a better look */}
        <label className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 cursor-pointer">
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          {file ? "Change file..." : "Choose file..."}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" // Hidden input
          />
        </label>

        {/* Show the selected file name */}
        {file && (
          <div className="inline-flex items-center ml-4 text-sm text-gray-700">
            <span>{file.name}</span>
            <button 
              onClick={clearFile} 
              className="ml-2 text-gray-400 hover:text-gray-600"
              title="Clear selection"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={submit}
        disabled={!file || isLoading}
        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Uploading…" : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;