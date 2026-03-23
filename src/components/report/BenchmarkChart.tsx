'use client';

import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface BenchmarkItem {
  term: string;
  your_contract: string;
  market_standard: string;
  assessment: 'standard' | 'below_standard' | 'above_standard';
}

interface BenchmarkChartProps {
  benchmarks: BenchmarkItem[];
}

export default function BenchmarkChart({ benchmarks }: BenchmarkChartProps) {
  if (!benchmarks || benchmarks.length === 0) return null;

  const data = benchmarks.map((b) => ({
    name: b.term,
    value: b.assessment === 'below_standard' ? -1 : b.assessment === 'above_standard' ? 1 : 0,
    yours: b.your_contract,
    standard: b.market_standard,
    assessment: b.assessment,
  }));

  const getColor = (assessment: string) => {
    switch (assessment) {
      case 'below_standard': return '#ef4444';
      case 'above_standard': return '#22c55e';
      default: return '#52525b';
    }
  };

  return (
    <div className="liquid-glass p-6" id="section-benchmarks">
      <h3 className="font-serif font-semibold text-white mb-4 text-lg section-title-editorial">
        Industry Benchmarks
      </h3>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
            <XAxis type="number" domain={[-1.5, 1.5]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="liquid-glass rounded-lg p-3 text-xs">
                    <p className="font-medium text-white mb-1">{d.name}</p>
                    <p className="text-zinc-400">Yours: <span className="text-zinc-200">{d.yours}</span></p>
                    <p className="text-zinc-400">Standard: <span className="text-zinc-200">{d.standard}</span></p>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" barSize={16} radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.assessment)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail rows below chart */}
      <div className="space-y-2 mt-4">
        {benchmarks.map((b, i) => (
          <div key={i} className="flex items-center justify-between text-xs px-1">
            <span className="text-zinc-400">{b.term}</span>
            <div className="flex items-center gap-4">
              <span className="text-zinc-300">{b.your_contract}</span>
              <span className="text-zinc-500">vs</span>
              <span className="text-zinc-300">{b.market_standard}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                b.assessment === 'below_standard'
                  ? 'bg-red-900/50 text-red-300 border border-red-800'
                  : b.assessment === 'above_standard'
                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {b.assessment === 'below_standard' ? 'Below' : b.assessment === 'above_standard' ? 'Above' : 'Standard'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
