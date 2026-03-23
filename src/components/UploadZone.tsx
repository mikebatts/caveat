'use client';

import { useCallback, useState } from 'react';
import { FileUp, Download } from '@/components/Icons';

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
        transition-all duration-300
        ${isDragging
          ? 'border-violet-500 scale-[1.02] liquid-glass-elevated'
          : 'border-zinc-700 hover:border-violet-500/50 liquid-glass'
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
        <div className="flex justify-center">
          {isAnalyzing ? (
            <div className="spinner spinner-lg" />
          ) : isDragging ? (
            <Download className="w-16 h-16 text-violet-400" />
          ) : (
            <FileUp className="w-16 h-16 text-zinc-400" />
          )}
        </div>

        <div>
          <p className="text-lg font-semibold text-zinc-100">
            {isAnalyzing
              ? 'Analyzing your contract...'
              : isDragging
              ? 'Drop your contract here'
              : 'Upload your contract'}
          </p>
          <p className="text-sm text-zinc-400 mt-1">
            {isAnalyzing
              ? 'This usually takes 30-60 seconds'
              : 'Drag & drop or click to select. PDF, DOCX, or TXT.'}
          </p>
        </div>

        {!isAnalyzing && (
          <p className="text-xs text-zinc-500">
            Max 10MB · Your contract is never stored
          </p>
        )}
      </div>
    </div>
  );
}
