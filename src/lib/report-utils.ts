export function riskColor(score: number): string {
  if (score <= 3) return 'risk-low';
  if (score <= 6) return 'risk-moderate';
  if (score <= 8) return 'risk-high';
  return 'risk-critical';
}

export function riskLabel(score: number): string {
  if (score <= 3) return 'Low Risk';
  if (score <= 6) return 'Moderate Risk';
  if (score <= 8) return 'High Risk';
  return 'Critical Risk';
}

export function riskHexColor(score: number): string {
  if (score <= 3) return '#4ade80';
  if (score <= 6) return '#fbbf24';
  if (score <= 8) return '#fb923c';
  return '#f87171';
}

export function severityDotColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-emerald-500',
  };
  return colors[severity] || 'bg-zinc-500';
}

export function severityHexColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#eab308',
    low: '#22c55e',
  };
  return colors[severity] || '#71717a';
}

export function findingCardClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'finding-critical';
    case 'high': return 'finding-high';
    case 'medium': return 'finding-medium';
    case 'low': return 'finding-low';
    default: return 'finding-medium';
  }
}

export function riskScorePercent(score: number): number {
  return Math.round((score / 10) * 100);
}

export interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function countBySeverity(items: Array<{ severity: string }>): SeverityCounts {
  return items.reduce(
    (acc, item) => {
      const s = item.severity as keyof SeverityCounts;
      if (s in acc) acc[s]++;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
}

export function totalFindings(counts: SeverityCounts): number {
  return counts.critical + counts.high + counts.medium + counts.low;
}
