'use client';

import { AlertTriangle, ShieldAlert, Flame, Lock } from '@/components/Icons';
import { SVGProps } from 'react';

interface StatItem {
  label: string;
  value: number;
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  color: string;
}

interface QuickStatsProps {
  stats: StatItem[];
}

export function legalStats(data: {
  redFlags: number;
  missingClauses: number;
  redlines: number;
  benchmarkDeviations: number;
}): StatItem[] {
  return [
    { label: 'Red Flags', value: data.redFlags, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Missing Clauses', value: data.missingClauses, icon: ShieldAlert, color: 'text-yellow-400' },
    { label: 'Redlines', value: data.redlines, icon: Flame, color: 'text-blue-400' },
    { label: 'Below Standard', value: data.benchmarkDeviations, icon: Lock, color: 'text-orange-400' },
  ];
}

export function smartStats(data: {
  vulnerabilities: number;
  gasIssues: number;
  accessControl: number;
  exploitMatches: number;
}): StatItem[] {
  return [
    { label: 'Vulnerabilities', value: data.vulnerabilities, icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Gas Issues', value: data.gasIssues, icon: Flame, color: 'text-orange-400' },
    { label: 'Access Control', value: data.accessControl, icon: Lock, color: 'text-yellow-400' },
    { label: 'Exploit Matches', value: data.exploitMatches, icon: AlertTriangle, color: 'text-red-400' },
  ];
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="liquid-glass rounded-2xl p-4 flex items-center gap-3">
          <stat.icon className={`w-5 h-5 flex-shrink-0 ${stat.color}`} />
          <div>
            <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
