import { ShieldAlert, Flame, Lock, ClipboardList, Shield, CheckCircle, Lightbulb, AlertTriangle } from '@/components/Icons';
import { SmartContractAnalysis, SmartContractPreviewResult } from '@/lib/solidity-analyzer';

interface SmartContractReportProps {
  result: (SmartContractAnalysis | SmartContractPreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function SmartContractReport({ result, onUnlock }: SmartContractReportProps) {
  const riskScore = 'overall_risk_score' in result ? result.overall_risk_score : result.risk_score;

  const riskColor = (score: number) => {
    if (score <= 3) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score <= 6) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (score <= 8) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
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
      case 'slither': return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Slither</span>;
      case 'ai': return <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">AI</span>;
      case 'both': return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Slither + AI</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Score */}
      <div className={`rounded-xl border p-6 ${riskColor(riskScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">Security Risk Score</p>
            <p className="text-4xl font-bold mt-1">{riskScore}/10</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{riskLabel(riskScore)}</p>
            {result.preview && 'vulnerability_count' in result && (
              <p className="text-sm opacity-75">{result.vulnerability_count} vulnerabilities found</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-cyan-400" /> Summary</h3>
        <p className="text-zinc-300">{result.summary}</p>
      </div>

      {/* Preview Mode: Paywall */}
      {result.preview && 'top_risks' in result && (
        <>
          {result.top_risks.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-cyan-400" /> Top Security Risks</h3>
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
          <div className="rounded-xl border p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            <p className="text-2xl font-bold text-white mb-2">Unlock Full Security Report</p>
            <p className="text-zinc-400 mb-6">
              Get detailed vulnerability analysis, gas optimizations, access control review, missing security patterns, and actionable fixes.
            </p>
            <button
              onClick={onUnlock}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg transition-colors cta-glow"
            >
              Unlock for $49 (Launch Price)
            </button>
            <p className="text-xs text-zinc-500 mt-3">
              One-time payment · 14-day money-back guarantee
            </p>
          </div>
        </>
      )}

      {/* Full Analysis */}
      {!result.preview && 'vulnerabilities' in result && (
        <>
          {/* Vulnerabilities */}
          {result.vulnerabilities.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-400" /> Vulnerabilities ({result.vulnerabilities.length})</h3>
              <div className="space-y-4">
                {result.vulnerabilities.map((vuln, i) => (
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
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {vuln.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gas Issues */}
          {result.gas_issues.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Gas Optimizations ({result.gas_issues.length})</h3>
              <div className="space-y-3">
                {result.gas_issues.map((issue, i) => (
                  <div key={i} className="border-l-4 border-blue-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{issue.description}</p>
                    {issue.location && (
                      <p className="text-zinc-500 text-xs font-mono">{issue.location}</p>
                    )}
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {issue.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Access Control */}
          {result.access_control.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> Access Control ({result.access_control.length})</h3>
              <div className="space-y-3">
                {result.access_control.map((item, i) => (
                  <div key={i} className="border-l-4 border-orange-500/50 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      {severityDot(item.severity)}
                      <span className="font-medium text-white">{item.issue}</span>
                    </div>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Patterns */}
          {result.missing_patterns.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-yellow-400" /> Missing Security Patterns ({result.missing_patterns.length})</h3>
              <div className="space-y-3">
                {result.missing_patterns.map((item, i) => (
                  <div key={i} className="border-l-4 border-yellow-500/50 pl-4 py-2">
                    <p className="font-medium text-white">{item.pattern}</p>
                    <p className="text-zinc-300 text-sm">{item.importance}</p>
                    <p className="text-zinc-400 text-sm italic flex items-start gap-1"><Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" /> {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Notes */}
          {result.compliance_notes.length > 0 && (
            <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-cyan-400" /> Compliance Notes ({result.compliance_notes.length})</h3>
              <div className="space-y-2">
                {result.compliance_notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {severityDot(note.severity === 'critical' ? 'critical' : note.severity === 'warning' ? 'medium' : 'low')}
                    <p className="text-zinc-300 text-sm">{note.issue}</p>
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
            <p className="flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> This is AI-generated analysis only. Not a security audit. Not financial advice.</p>
            <p>AI can miss exploits. Always get a professional audit before deploying to mainnet.</p>
          </div>
        </>
      )}
    </div>
  );
}
