import { ContractAnalysis, PreviewResult } from '@/lib/analyzer';

interface AnalysisReportProps {
  result: (ContractAnalysis | PreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function AnalysisReport({ result, onUnlock }: AnalysisReportProps) {
  const riskColor = (score: number) => {
    if (score <= 3) return 'text-green-600 bg-green-50 border-green-200';
    if (score <= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score <= 8) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const riskLabel = (score: number) => {
    if (score <= 3) return 'Low Risk';
    if (score <= 6) return 'Moderate Risk';
    if (score <= 8) return 'High Risk';
    return 'Critical Risk';
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className={`rounded-xl border p-6 ${riskColor(result.risk_score)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">Overall Risk Score</p>
            <p className="text-4xl font-bold mt-1">{result.risk_score}/10</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{riskLabel(result.risk_score)}</p>
            {result.preview && 'red_flag_count' in result && (
              <p className="text-sm opacity-75">{result.red_flag_count} issues found</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">📋 Summary</h3>
        <p className="text-gray-700">{result.summary}</p>
      </div>

      {/* Preview Mode: Paywall */}
      {result.preview && 'top_risks' in result && (
        <>
          {/* Top Risks Preview */}
          {'top_risks' in result && result.top_risks.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">⚠️ Top Risks Detected</h3>
              <ul className="space-y-2">
                {result.top_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-500 mt-0.5">→</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paywall */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-8 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-2">Unlock Full Analysis</p>
            <p className="text-gray-600 mb-6">
              Get detailed red flags, missing clauses, unfavorable terms, compliance notes, and actionable recommendations.
            </p>
            <button
              onClick={onUnlock}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Unlock for $49 (Launch Price)
            </button>
            <p className="text-xs text-gray-500 mt-3">
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
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🚩 Red Flags ({result.red_flags.length})</h3>
              <div className="space-y-4">
                {result.red_flags.map((flag, i) => (
                  <div key={i} className="border-l-4 border-red-300 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{severityColor(flag.severity)}</span>
                      <span className="font-medium text-gray-900">{flag.clause}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{flag.risk}</p>
                    <p className="text-gray-600 text-sm italic">💡 {flag.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Clauses */}
          {result.missing_clauses.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">📝 Missing Clauses ({result.missing_clauses.length})</h3>
              <div className="space-y-3">
                {result.missing_clauses.map((clause, i) => (
                  <div key={i} className="border-l-4 border-yellow-300 pl-4 py-2">
                    <p className="font-medium text-gray-900">{clause.clause}</p>
                    <p className="text-gray-700 text-sm">{clause.importance}</p>
                    <p className="text-gray-600 text-sm italic">💡 {clause.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unfavorable Terms */}
          {result.unfavorable_terms.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">⚖️ Unfavorable Terms ({result.unfavorable_terms.length})</h3>
              <div className="space-y-3">
                {result.unfavorable_terms.map((term, i) => (
                  <div key={i} className="border-l-4 border-orange-300 pl-4 py-2">
                    <p className="font-medium text-gray-900">{term.term}</p>
                    <p className="text-gray-700 text-sm">{term.why_unfavorable}</p>
                    <p className="text-gray-600 text-sm italic">💡 {term.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">✅ Recommended Actions</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-600 font-bold">{i + 1}.</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t">
            <p>⚠️ This is AI-generated analysis only. Not legal advice.</p>
            <p>Always consult a licensed attorney before making legal decisions.</p>
          </div>
        </>
      )}
    </div>
  );
}
