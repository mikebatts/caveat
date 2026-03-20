'use client';

import { useState } from 'react';
import SeverityMiniBar from './SeverityMiniBar';
import { SeverityCounts } from '@/lib/report-utils';

interface CollapsibleSectionProps {
  id?: string;
  title: string;
  count: number;
  icon?: React.ReactNode;
  severityCounts?: SeverityCounts;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  id,
  title,
  count,
  icon,
  severityCounts,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="liquid-glass p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 text-left"
      >
        {icon}
        <h3 className="font-serif text-lg font-semibold text-white flex-1" style={{ fontFamily: 'var(--font-serif)' }}>
          {title}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
          {count}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {severityCounts && (
        <div className="mt-3">
          <SeverityMiniBar counts={severityCounts} />
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[10000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
