'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { riskHexColor, riskLabel, riskScorePercent } from '@/lib/report-utils';

interface RiskGaugeProps {
  score: number;
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  const percent = riskScorePercent(score);
  const color = riskHexColor(score);
  const label = riskLabel(score);

  const data = [
    { name: 'bg', value: 100, fill: 'rgba(255,255,255,0.08)' },
    { name: 'score', value: percent, fill: color },
  ];

  return (
    <div className="relative w-[200px] h-[200px] flex-shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          startAngle={225}
          endAngle={-45}
          data={data}
          barSize={12}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white font-serif">{score}</span>
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}
