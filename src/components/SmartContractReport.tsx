import { ShieldAlert, Flame, Lock, ClipboardList, Shield, CheckCircle, Lightbulb, AlertTriangle } from '@/components/Icons';
import { SmartContractAnalysis, SmartContractPreviewResult } from '@/lib/solidity-analyzer';

interface SmartContractReportProps {
  result: (SmartContractAnalysis | SmartContractPreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function SmartContractReport({ result, onUnlock }: SmartContractReportProps) {
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

  const sourceBadge = (source: string) => {
    switch (source) {
      case 'slither': return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800">Slither</span>;
      case 'ai': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">AI</span>;
      case 'both': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">Slither + AI</span>;
      default: return null;
    }
  };

  const priorityBadge = (priority: string) => {
    switch (priority) {
      case 'do_first': return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-800">DO FIRST</span>;
      case 'important': return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-800">Important</span>;
      case 'nice_to_have': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Nice to have</span>;
      default: return null;
    }
  };

  const isFullAnalysis = !result.preview && 'vulnerabilities' in result;
  const fullResult = isFullAnalysis ? result as SmartContractAnalysis : null;

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className={`rounded-xl border p-6 ${riskColor(riskScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Security Risk Score</p>
            <p className="text-4xl font-bold mt-1">{riskScore}/10</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{riskLabel(riskScore)}</p>
            {result.preview && 'vulnerability_count' in result && (
              <p className="text-sm">{result.vulnerability_count} vulnerabilities found</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-zinc-400" /> Summary</h3>
        <p className="text-zinc-300">{result.summary}</p>
      </div>

      {/* Preview Mode: Paywall */}
      {result.preview && 'top_risks' in result && (
        <>
          {result.top_risks.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-zinc-400" /> Top Security Risks</h3>
              <ul className="space-y-2">
                {result.top_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-400 mt-0.5">&rarr;</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Paywall */}
          <div className="paywall-card rounded-xl p-8 text-center">
            <p className="text-2xl font-bold text-white mb-2">Unlock Full Security Report</p>
            <p className="text-zinc-300 mb-6">
              Get architecture review, known exploit matching, detailed vulnerability analysis, and priority-ranked fixes.
            </p>
            <button
              onClick={onUnlock}
              className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get 5 Credits &mdash; $49
            </button>
            <p className="text-xs text-zinc-400 mt-3">
              Just $9.80 per analysis &middot; 14-day money-back guarantee
            </p>
          </div>
        </>
      )}

      {/* Full Analysis */}
      {fullResult && (
        <>
          {/* Executive Summary */}
          {fullResult.executive_summary && fullResult.executive_summary.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3">Executive Summary</h3>
              <ul className="space-y-2">
                {fullResult.executive_summary.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.action_required ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    {item.point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture Review */}
          {fullResult.architecture_review && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3">Architecture Review</h3>
              <div className="mb-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">{fullResult.architecture_review.pattern}</span>
              </div>
              <p className="text-zinc-300 text-sm mb-3">{fullResult.architecture_review.assessment}</p>
              {fullResult.architecture_review.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-zinc-500 mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {fullResult.architecture_review.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-emerald-300 text-sm">
                        <span className="mt-0.5">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {fullResult.architecture_review.concerns.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Concerns</p>
                  <ul className="space-y-1">
                    {fullResult.architecture_review.concerns.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-300 text-sm">
                        <span className="mt-0.5">-</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Known Exploit Matches */}
          {fullResult.known_exploit_matches && fullResult.known_exploit_matches.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Known Exploit Matches</h3>
              <div className="space-y-3">
                {fullResult.known_exploit_matches.map((match, i) => (
                  <div key={i} className="border-l-4 border-red-500/50 pl-4 py-2">
                    <p className="font-medium text-red-300">{match.exploit_name}</p>
                    <p className="text-zinc-300 text-sm">{match.similarity}</p>
                    <p className="text-zinc-500 text-xs font-mono mt-1">Affected: {match.affected_function}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vulnerabilities */}
          {fullResult.vulnerabilities.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-400" /> Vulnerabilities ({fullResult.vulnerabilities.length})</h3>
              <div className="space-y-4">
                {fullResult.vulnerabilities.map((vuln, i) => (
                  <div key={i} className="border-l-4 border-red-500/50 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {severityDot(vuln.severity)}
                      <span className="font-medium text-white">{vuln.title}</span>
                      {sourceBadge(vuln.source)}
                    </div>
                    <p className="text-zinc-300 text-sm mb-1">{vuln.description}</p>
                    {vuln.location && (
                      <p className="text-zinc-500 text-xs font-mono mb-1">Location: {vuln.location}</p>
                    )}
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" /> {vuln.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gas Issues */}
          {fullResult.gas_issues.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Gas Optimizations ({fullResult.gas_issues.length})</h3>
              <div className="space-y-3">
                {fullResult.gas_issues.map((issue, i) => (
                  <div key={i} className="border-l-4 border-blue-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{issue.description}</p>
                    {issue.location && (
                      <p className="text-zinc-500 text-xs font-mono">{issue.location}</p>
                    )}
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" /> {issue.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access Control */}
          {fullResult.access_control.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> Access Control ({fullResult.access_control.length})</h3>
              <div className="space-y-3">
                {fullResult.access_control.map((item, i) => (
                  <div key={i} className="border-l-4 border-orange-500/50 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      {severityDot(item.severity)}
                      <span className="font-medium text-white">{item.issue}</span>
                    </div>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" /> {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Patterns */}
          {fullResult.missing_patterns.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-yellow-400" /> Missing Security Patterns ({fullResult.missing_patterns.length})</h3>
              <div className="space-y-3">
                {fullResult.missing_patterns.map((item, i) => (
                  <div key={i} className="border-l-4 border-yellow-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{item.pattern}</p>
                    <p className="text-zinc-300 text-sm">{item.importance}</p>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-zinc-400" /> {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Notes */}
          {fullResult.compliance_notes.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-zinc-400" /> Compliance Notes ({fullResult.compliance_notes.length})</h3>
              <div className="space-y-2">
                {fullResult.compliance_notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {severityDot(note.severity === 'critical' ? 'critical' : note.severity === 'warning' ? 'medium' : 'low')}
                    <p className="text-zinc-300 text-sm">{note.issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {fullResult.recommendations.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-zinc-400" /> Recommended Actions</h3>
              <ul className="space-y-2">
                {fullResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="flex-shrink-0 mt-0.5">{priorityBadge(rec.priority)}</span>
                    {rec.action}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-center text-xs text-zinc-500 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> This is AI-generated analysis only. Not a security audit. Not financial advice.</p>
            <p>AI can miss exploits. Always get a professional audit before deploying to mainnet.</p>
          </div>
        </>
      )}
    </div>
  );
}
