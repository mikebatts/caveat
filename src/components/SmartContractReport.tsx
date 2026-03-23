'use client';

import { ShieldAlert, Flame, Lock, ClipboardList, Shield, CheckCircle, AlertTriangle } from '@/components/Icons';
import { SmartContractAnalysis, SmartContractPreviewResult } from '@/lib/solidity-analyzer';
import { countBySeverity, SeverityCounts } from '@/lib/report-utils';
import ReportCommandCenter from './report/ReportCommandCenter';
import { smartStats } from './report/QuickStats';
import CollapsibleSection from './report/CollapsibleSection';
import FindingCard from './report/FindingCard';
import ReportNav from './report/ReportNav';
import ExportButton from './report/ExportButton';
import RiskGauge from './report/RiskGauge';

interface SmartContractReportProps {
  result: (SmartContractAnalysis | SmartContractPreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function SmartContractReport({ result, onUnlock }: SmartContractReportProps) {
  const riskScore = 'overall_risk_score' in result ? result.overall_risk_score : result.risk_score;

  const sourceBadge = (source: string) => {
    switch (source) {
      case 'slither': return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800">Slither</span>;
      case 'ai': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">AI</span>;
      case 'both': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">Slither + AI</span>;
      default: return null;
    }
  };

  const isFullAnalysis = !result.preview && 'vulnerabilities' in result;
  const fullResult = isFullAnalysis ? result as SmartContractAnalysis : null;

  // Compute severity counts
  const allSeverityItems: Array<{ severity: string }> = [];
  if (fullResult) {
    fullResult.vulnerabilities.forEach((v) => allSeverityItems.push({ severity: v.severity }));
    fullResult.access_control.forEach((a) => allSeverityItems.push({ severity: a.severity }));
  }
  const severityCounts: SeverityCounts = countBySeverity(allSeverityItems);

  const stats = fullResult ? smartStats({
    vulnerabilities: fullResult.vulnerabilities.length,
    gasIssues: fullResult.gas_issues.length,
    accessControl: fullResult.access_control.length,
    exploitMatches: fullResult.known_exploit_matches?.length || 0,
  }) : smartStats({ vulnerabilities: 0, gasIssues: 0, accessControl: 0, exploitMatches: 0 });

  // Build nav sections
  const navSections = fullResult ? [
    { id: 'section-command', label: 'Overview' },
    { id: 'section-summary', label: 'Executive Summary' },
    ...(fullResult.architecture_review ? [{ id: 'section-architecture', label: 'Architecture' }] : []),
    ...(fullResult.known_exploit_matches?.length ? [{ id: 'section-exploits', label: 'Exploits', count: fullResult.known_exploit_matches.length }] : []),
    ...(fullResult.vulnerabilities.length ? [{ id: 'section-vulns', label: 'Vulnerabilities', count: fullResult.vulnerabilities.length }] : []),
    ...(fullResult.gas_issues.length ? [{ id: 'section-gas', label: 'Gas', count: fullResult.gas_issues.length }] : []),
    ...(fullResult.access_control.length ? [{ id: 'section-access', label: 'Access Control', count: fullResult.access_control.length }] : []),
    ...(fullResult.missing_patterns.length ? [{ id: 'section-patterns', label: 'Missing Patterns', count: fullResult.missing_patterns.length }] : []),
    { id: 'section-actions', label: 'Actions', count: fullResult.recommendations.length },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Preview Mode */}
      {result.preview && 'top_risks' in result && (
        <>
          {/* Teaser: show risk gauge */}
          <div className="command-center p-8 flex flex-col items-center gap-4">
            <RiskGauge score={riskScore} />
            <p className="text-zinc-300 text-center">{result.summary}</p>
            {'vulnerability_count' in result && (
              <p className="text-sm text-zinc-400">{result.vulnerability_count} vulnerabilities found</p>
            )}
          </div>

          {result.top_risks.length > 0 && (
            <div className="liquid-glass p-6 relative overflow-hidden">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-zinc-400" /> Top Security Risks
              </h3>
              <ul className="space-y-2">
                {result.top_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-400 mt-0.5">&rarr;</span>
                    {risk}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            </div>
          )}

          {/* Paywall */}
          <div className="liquid-glass-violet accent-glow-ring rounded-2xl p-10 text-center">
            <p className="text-3xl font-bold text-white mb-2 font-serif">
              Unlock Full Security Report
            </p>
            <p className="text-zinc-300 mb-6">
              Get architecture review, known exploit matching, detailed vulnerability analysis, and priority-ranked fixes.
            </p>
            <button
              onClick={onUnlock}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-violet-600/25"
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
          <ReportNav sections={navSections} />

          <div className="flex items-center justify-end gap-3" data-pdf-hidden>
            <ExportButton reportId="caveat-report" filename="caveat-smart-contract-report.pdf" />
          </div>

          <div id="caveat-report" className="space-y-8">
            {/* Command Center */}
            <div id="section-command">
              <ReportCommandCenter
                riskScore={riskScore}
                severityCounts={severityCounts}
                stats={stats}
              />
            </div>

            {/* Executive Summary */}
            {fullResult.executive_summary && fullResult.executive_summary.length > 0 && (
              <div id="section-summary" className="liquid-glass p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-white mb-4 section-title-editorial">
                  Executive Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Action Required</p>
                    {fullResult.executive_summary.filter((s) => s.action_required).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                        <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                        {item.point}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Informational</p>
                    {fullResult.executive_summary.filter((s) => !s.action_required).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                        <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400" />
                        {item.point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Architecture Review */}
            {fullResult.architecture_review && (
              <div id="section-architecture" className="liquid-glass p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-white mb-4 section-title-editorial">
                  Architecture Review
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 font-medium">
                      {fullResult.architecture_review.pattern}
                    </span>
                    <p className="text-zinc-300 text-sm mt-3">{fullResult.architecture_review.assessment}</p>
                  </div>
                  <div className="space-y-3">
                    {fullResult.architecture_review.strengths.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Strengths</p>
                        <ul className="space-y-1">
                          {fullResult.architecture_review.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-emerald-300 text-sm">
                              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {fullResult.architecture_review.concerns.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Concerns</p>
                        <ul className="space-y-1">
                          {fullResult.architecture_review.concerns.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-red-300 text-sm">
                              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Known Exploit Matches */}
            {fullResult.known_exploit_matches && fullResult.known_exploit_matches.length > 0 && (
              <CollapsibleSection
                id="section-exploits"
                title="Known Exploit Matches"
                count={fullResult.known_exploit_matches.length}
                icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                defaultOpen={true}
              >
                {fullResult.known_exploit_matches.map((match, i) => (
                  <div key={i} className="finding-critical">
                    <p className="font-medium text-red-300">{match.exploit_name}</p>
                    <p className="text-zinc-300 text-sm mt-1">{match.similarity}</p>
                    <p className="text-zinc-500 text-xs font-mono mt-1">Affected: {match.affected_function}</p>
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {/* Vulnerabilities */}
            {fullResult.vulnerabilities.length > 0 && (
              <CollapsibleSection
                id="section-vulns"
                title="Vulnerabilities"
                count={fullResult.vulnerabilities.length}
                icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
                severityCounts={countBySeverity(fullResult.vulnerabilities)}
                defaultOpen={true}
              >
                {fullResult.vulnerabilities.map((vuln, i) => (
                  <FindingCard
                    key={i}
                    severity={vuln.severity}
                    title={vuln.title}
                    description={vuln.description}
                    recommendation={vuln.recommendation}
                    location={vuln.location}
                    badge={sourceBadge(vuln.source)}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Gas Optimizations */}
            {fullResult.gas_issues.length > 0 && (
              <CollapsibleSection
                id="section-gas"
                title="Gas Optimizations"
                count={fullResult.gas_issues.length}
                icon={<Flame className="w-4 h-4 text-orange-400" />}
                defaultOpen={false}
              >
                {fullResult.gas_issues.map((issue, i) => (
                  <FindingCard
                    key={i}
                    severity={issue.severity === 'info' ? 'low' : issue.severity}
                    title={issue.description}
                    location={issue.location}
                    recommendation={issue.suggestion}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Access Control */}
            {fullResult.access_control.length > 0 && (
              <CollapsibleSection
                id="section-access"
                title="Access Control"
                count={fullResult.access_control.length}
                icon={<Lock className="w-4 h-4 text-orange-400" />}
                severityCounts={countBySeverity(fullResult.access_control)}
                defaultOpen={true}
              >
                {fullResult.access_control.map((item, i) => (
                  <FindingCard
                    key={i}
                    severity={item.severity}
                    title={item.issue}
                    recommendation={item.recommendation}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Missing Patterns */}
            {fullResult.missing_patterns.length > 0 && (
              <CollapsibleSection
                id="section-patterns"
                title="Missing Security Patterns"
                count={fullResult.missing_patterns.length}
                icon={<ClipboardList className="w-4 h-4 text-yellow-400" />}
                defaultOpen={false}
              >
                {fullResult.missing_patterns.map((item, i) => (
                  <FindingCard
                    key={i}
                    severity="medium"
                    title={item.pattern}
                    description={item.importance}
                    recommendation={item.recommendation}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Compliance Notes */}
            {fullResult.compliance_notes.length > 0 && (
              <CollapsibleSection
                id="section-compliance"
                title="Compliance Notes"
                count={fullResult.compliance_notes.length}
                icon={<Shield className="w-4 h-4 text-zinc-400" />}
                defaultOpen={false}
              >
                {fullResult.compliance_notes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-300 text-sm py-1">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      note.severity === 'critical' ? 'bg-red-500' : note.severity === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`} />
                    {note.issue}
                  </div>
                ))}
              </CollapsibleSection>
            )}

            {/* Recommendations */}
            {fullResult.recommendations.length > 0 && (
              <div id="section-actions" className="liquid-glass p-6 md:p-8">
                <h3 className="font-serif text-xl font-semibold text-white mb-4 flex items-center gap-2 section-title-editorial">
                  <CheckCircle className="w-4 h-4 text-zinc-400" /> Recommended Actions
                </h3>

                {fullResult.recommendations.filter((r) => r.priority === 'do_first').length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2">Do First</p>
                    <ol className="space-y-2">
                      {fullResult.recommendations
                        .filter((r) => r.priority === 'do_first')
                        .map((rec, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-200">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-900/50 text-red-300 border border-red-800 flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            {rec.action}
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                {fullResult.recommendations.filter((r) => r.priority === 'important').length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-yellow-400 uppercase tracking-wider mb-2">Important</p>
                    <ol className="space-y-2">
                      {fullResult.recommendations
                        .filter((r) => r.priority === 'important')
                        .map((rec, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-300">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-800 flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            {rec.action}
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                {fullResult.recommendations.filter((r) => r.priority === 'nice_to_have').length > 0 && (
                  <div className="opacity-70">
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Nice to Have</p>
                    <ul className="space-y-1.5">
                      {fullResult.recommendations
                        .filter((r) => r.priority === 'nice_to_have')
                        .map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                            <span className="text-zinc-600 mt-0.5">&bull;</span>
                            {rec.action}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="section-divider" />
            <div className="text-center text-xs text-zinc-500 pt-4">
              <p className="flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> This is AI-generated analysis only. Not a security audit. Not financial advice.</p>
              <p>AI can miss exploits. Always get a professional audit before deploying to mainnet.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
