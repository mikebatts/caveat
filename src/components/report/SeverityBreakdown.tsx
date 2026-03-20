'use client';

import { SeverityCounts, totalFindings } from '@/lib/report-utils';

interface SeverityBreakdownProps {
  counts: SeverityCounts;
}

const segments: { key: keyof SeverityCounts; label: string; color: string; bg: string }[] = [
  { key: 'critical', label: 'Critical', color: '#ef4444', bg: 'bg-red-500' },
  { key: 'high', label: 'High', color: '#f59e0b', bg: 'bg-amber-500' },
  { key: 'medium', label: 'Medium', color: '#eab308', bg: 'bg-yellow-500' },
  { key: 'low', label: 'Low', color: '#22c55e', bg: 'bg-emerald-500' },
];

export default function SeverityBreakdown({ counts }: SeverityBreakdownProps) {
  const total = totalFindings(counts);
  if (total === 0) return null;

  return (
    <div>
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {segments.map(({ key, color }) => {
          const pct = (counts[key] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="rounded-full transition-all duration-300"
            />
          );
        })}
      </div>

      {/* Legend pills */}
      <div className="flex flex-wrap gap-3 mt-3">
        {segments.map(({ key, label, bg }) => {
          if (counts[key] === 0) return null;
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span className={`w-2 h-2 rounded-full ${bg}`} />
              {counts[key]} {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
