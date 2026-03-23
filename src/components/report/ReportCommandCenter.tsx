'use client';

import RiskGauge from './RiskGauge';
import SeverityBreakdown from './SeverityBreakdown';
import QuickStats from './QuickStats';
import { SeverityCounts } from '@/lib/report-utils';
import { SVGProps } from 'react';

interface StatItem {
  label: string;
  value: number;
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  color: string;
}

interface ReportCommandCenterProps {
  riskScore: number;
  contractType?: string;
  severityCounts: SeverityCounts;
  stats: StatItem[];
}

export default function ReportCommandCenter({ riskScore, contractType, severityCounts, stats }: ReportCommandCenterProps) {
  return (
    <div className="command-center p-8 md:p-10 space-y-5">
      {contractType && (
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 font-medium">
            {contractType}
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
        {/* Left: Risk Gauge */}
        <RiskGauge score={riskScore} />

        {/* Right: Severity + Stats */}
        <div className="flex-1 space-y-4 w-full">
          <SeverityBreakdown counts={severityCounts} />
          <QuickStats stats={stats} />
        </div>
      </div>
    </div>
  );
}
