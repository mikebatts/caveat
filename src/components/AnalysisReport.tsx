import { AlertTriangle, FileSearch, Scale, CheckCircle, Lightbulb } from '@/components/Icons';
import { ContractAnalysis, PreviewResult } from '@/lib/analyzer';

interface AnalysisReportProps {
  result: (ContractAnalysis | PreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function AnalysisReport({ result, onUnlock }: AnalysisReportProps) {
  const riskScore = 'overall_risk_score' in result ? result.overall_risk_score : result.risk_score;

  const riskColor = (score: number) => {
    if (score <= 3) return 'risk-low';
    if (score <= 6) return 'risk-moderate';
    if (score <= 8) return 'risk-high';
    return 'risk-critical';
  };

  const riskLabel = (score: number) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 6) return 'Moderate Risk';
    if (score <= 8) return 'High Risk';
    return 'Critical Risk';
  };

  const severityDot = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-emerald-500',
    };
    return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[severity] || 'bg-zinc-500'}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className={`rounded-xl border p-6 ${riskColor(riskScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Overall Risk Score</p>
            <p className="text-4xl font-bold mt-1">{riskScore}/10</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{riskLabel(riskScore)}</p>
            {result.preview && 'red_flag_count' in result && (
              <p className="text-sm">{result.red_flag_count} issues found</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><FileSearch className="w-4 h-4 text-cyan-400" /> Summary</h3>
        <p className="text-zinc-300">{result.summary}</p>
      </div>

      {/* Preview Mode: Paywall */}
      {result.preview && 'top_risks' in result && (
        <>
          {'top_risks' in result && result.top_risks.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-cyan-400" /> Top Risks Detected</h3>
              <ul className="space-y-2">
                {result.top_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-cyan-400 mt-0.5">→</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paywall */}
          <div className="paywall-card rounded-xl p-8 text-center">
            <p className="text-2xl font-bold text-white mb-2">Unlock Full Analysis</p>
            <p className="text-zinc-300 mb-6">
              Get detailed red flags, missing clauses, unfavorable terms, compliance notes, and actionable recommendations.
            </p>
            <button
              onClick={onUnlock}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg transition-colors cta-glow"
            >
              Unlock for $49 (Launch Price)
            </button>
            <p className="text-xs text-zinc-400 mt-3">
              One-time payment · Lifetime access · 14-day money-back guarantee
            </p>
          </div>
        </>
      )}

      {/* Full Analysis */}
      {!result.preview && 'red_flags' in result && (
        <>
          {/* Red Flags */}
          {result.red_flags.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Red Flags ({result.red_flags.length})</h3>
              <div className="space-y-4">
                {result.red_flags.map((flag, i) => (
                  <div key={i} className="border-l-4 border-red-500/50 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      {severityDot(flag.severity)}
                      <span className="font-medium text-white">{flag.clause}</span>
                    </div>
                    <p className="text-zinc-300 text-sm mb-1">{flag.risk}</p>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {flag.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Clauses */}
          {result.missing_clauses.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FileSearch className="w-4 h-4 text-yellow-400" /> Missing Clauses ({result.missing_clauses.length})</h3>
              <div className="space-y-3">
                {result.missing_clauses.map((clause, i) => (
                  <div key={i} className="border-l-4 border-yellow-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{clause.clause}</p>
                    <p className="text-zinc-300 text-sm">{clause.importance}</p>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {clause.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unfavorable Terms */}
          {result.unfavorable_terms.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-orange-400" /> Unfavorable Terms ({result.unfavorable_terms.length})</h3>
              <div className="space-y-3">
                {result.unfavorable_terms.map((term, i) => (
                  <div key={i} className="border-l-4 border-orange-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{term.term}</p>
                    <p className="text-zinc-300 text-sm">{term.why_unfavorable}</p>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {term.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'rgba(6, 182, 212, 0.05)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Recommended Actions</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-cyan-400 font-bold">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center text-xs text-zinc-500 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> This is AI-generated analysis only. Not legal advice.</p>
            <p>Always consult a licensed attorney before making legal decisions.</p>
          </div>
        </>
      )}
    </div>
  );
}
