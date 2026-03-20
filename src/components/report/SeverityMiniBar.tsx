import { SeverityCounts, totalFindings } from '@/lib/report-utils';

interface SeverityMiniBarProps {
  counts: SeverityCounts;
}

const colors: { key: keyof SeverityCounts; hex: string; label: string }[] = [
  { key: 'critical', hex: '#ef4444', label: 'critical' },
  { key: 'high', hex: '#f59e0b', label: 'high' },
  { key: 'medium', hex: '#eab308', label: 'medium' },
  { key: 'low', hex: '#22c55e', label: 'low' },
];

export default function SeverityMiniBar({ counts }: SeverityMiniBarProps) {
  const total = totalFindings(counts);
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-1.5 rounded-full overflow-hidden flex-1 gap-px">
        {colors.map(({ key, hex }) => {
          const pct = (counts[key] / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              style={{ width: `${pct}%`, backgroundColor: hex }}
              className="rounded-full"
            />
          );
        })}
      </div>
      <div className="flex gap-2 text-xs text-zinc-500 flex-shrink-0">
        {colors.map(({ key, label }) => {
          if (counts[key] === 0) return null;
          return (
            <span key={key}>{counts[key]} {label}</span>
          );
        })}
      </div>
    </div>
  );
}
