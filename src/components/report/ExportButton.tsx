'use client';

import { useState } from 'react';
import { Download } from '@/components/Icons';

interface ExportButtonProps {
  reportId: string;
  filename?: string;
}

export default function ExportButton({ reportId, filename = 'caveat-report.pdf' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportReportAsPDF } = await import('@/lib/pdf-export');
      await exportReportAsPDF(reportId, filename);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      data-pdf-hidden
      className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </button>
  );
}
