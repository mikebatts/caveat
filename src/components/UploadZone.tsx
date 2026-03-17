'use client';

import { useCallback, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export default function UploadZone({ onFileSelect, isAnalyzing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragging
          ? 'border-amber-500 bg-amber-50 scale-[1.02]'
          : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
        }
        ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isAnalyzing}
      />

      <div className="space-y-4">
        <div className="text-5xl">
          {isAnalyzing ? '⏳' : isDragging ? '📥' : '📄'}
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-900">
            {isAnalyzing
              ? 'Analyzing your contract...'
              : isDragging
              ? 'Drop your contract here'
              : 'Upload your contract'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isAnalyzing
              ? 'This usually takes 30-60 seconds'
              : 'Drag & drop or click to select. PDF, DOCX, or TXT.'}
          </p>
        </div>

        {!isAnalyzing && (
          <p className="text-xs text-gray-400">
            Max 10MB · Your contract is never stored
          </p>
        )}
      </div>
    </div>
  );
}
