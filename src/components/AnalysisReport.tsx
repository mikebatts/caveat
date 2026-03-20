'use client';

import { AlertTriangle, FileSearch, Scale, CheckCircle } from '@/components/Icons';
import { ContractAnalysis, PreviewResult } from '@/lib/analyzer';
import { riskColor, countBySeverity, SeverityCounts } from '@/lib/report-utils';
import ReportCommandCenter from './report/ReportCommandCenter';
import { legalStats } from './report/QuickStats';
import CollapsibleSection from './report/CollapsibleSection';
import FindingCard from './report/FindingCard';
import BenchmarkChart from './report/BenchmarkChart';
import CopyButton from './report/CopyButton';
import ReportNav from './report/ReportNav';
import ExportButton from './report/ExportButton';
import RiskGauge from './report/RiskGauge';

interface AnalysisReportProps {
  result: (ContractAnalysis | PreviewResult) & { preview: boolean };
  onUnlock: () => void;
}

export default function AnalysisReport({ result, onUnlock }: AnalysisReportProps) {
  const riskScore = 'overall_risk_score' in result ? result.overall_risk_score : result.risk_score;

  const leverageBadge = (leverage: string) => {
    switch (leverage) {
      case 'high': return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-800">High leverage</span>;
      case 'medium': return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-800">Medium leverage</span>;
      case 'low': return <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Low leverage</span>;
      default: return null;
    }
  };

  const isFullAnalysis = !result.preview && 'red_flags' in result;
  const fullResult = isFullAnalysis ? result as ContractAnalysis : null;

  // Compute severity counts from all findings
  const allSeverityItems: Array<{ severity: string }> = [];
  if (fullResult) {
    fullResult.red_flags.forEach((f) => allSeverityItems.push({ severity: f.severity }));
    fullResult.cross_clause_risks?.forEach((f) => allSeverityItems.push({ severity: f.severity }));
  }
  const severityCounts: SeverityCounts = countBySeverity(allSeverityItems);

  const stats = fullResult ? legalStats({
    redFlags: fullResult.red_flags.length,
    missingClauses: fullResult.missing_clauses.length,
    redlines: fullResult.redline_suggestions?.length || 0,
    benchmarkDeviations: fullResult.industry_benchmarks?.filter((b) => b.assessment === 'below_standard').length || 0,
  }) : legalStats({ redFlags: 0, missingClauses: 0, redlines: 0, benchmarkDeviations: 0 });

  // Build nav sections
  const navSections = fullResult ? [
    { id: 'section-command', label: 'Overview' },
    { id: 'section-summary', label: 'Executive Summary', count: fullResult.executive_summary?.length || 0 },
    ...(fullResult.cross_clause_risks?.length ? [{ id: 'section-crossclause', label: 'Cross-Clause', count: fullResult.cross_clause_risks.length }] : []),
    ...(fullResult.redline_suggestions?.length ? [{ id: 'section-redlines', label: 'Redlines', count: fullResult.redline_suggestions.length }] : []),
    ...(fullResult.industry_benchmarks?.length ? [{ id: 'section-benchmarks', label: 'Benchmarks', count: fullResult.industry_benchmarks.length }] : []),
    ...(fullResult.red_flags.length ? [{ id: 'section-redflags', label: 'Red Flags', count: fullResult.red_flags.length }] : []),
    ...(fullResult.missing_clauses.length ? [{ id: 'section-missing', label: 'Missing Clauses', count: fullResult.missing_clauses.length }] : []),
    ...(fullResult.unfavorable_terms.length ? [{ id: 'section-unfavorable', label: 'Unfavorable Terms', count: fullResult.unfavorable_terms.length }] : []),
    { id: 'section-actions', label: 'Actions', count: fullResult.recommendations.length },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Preview Mode */}
      {result.preview && 'top_risks' in result && (
        <>
          {/* Teaser: show risk gauge */}
          <div className="liquid-glass-elevated p-6 flex flex-col items-center gap-4">
            <RiskGauge score={riskScore} />
            <p className="text-zinc-300 text-center">{result.summary}</p>
          </div>

          {'top_risks' in result && result.top_risks.length > 0 && (
            <div className="liquid-glass p-6 relative overflow-hidden">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-zinc-400" /> Top Risks Detected
              </h3>
              <ul className="space-y-2">
                {result.top_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-400 mt-0.5">&rarr;</span>
                    {risk}
                  </li>
                ))}
              </ul>
              {/* Blur/fade overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            </div>
          )}

          {/* Paywall */}
          <div className="liquid-glass-elevated accent-glow-ring rounded-2xl p-8 text-center">
            <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Unlock Full Analysis
            </p>
            <p className="text-zinc-300 mb-6">
              Get redline suggestions, cross-clause risks, industry benchmarks, and priority-ranked action items.
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
            <ExportButton reportId="caveat-report" filename="caveat-legal-report.pdf" />
          </div>

          <div id="caveat-report" className="space-y-6">
            {/* Command Center */}
            <div id="section-command">
              <ReportCommandCenter
                riskScore={riskScore}
                contractType={fullResult.contract_type}
                severityCounts={severityCounts}
                stats={stats}
              />
            </div>

            {/* Executive Summary */}
            {fullResult.executive_summary && fullResult.executive_summary.length > 0 && (
              <div id="section-summary" className="liquid-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  Executive Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Action required */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-red-400 uppercase tracking-wider">Action Required</p>
                    {fullResult.executive_summary.filter((s) => s.action_required).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                        <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                        {item.point}
                      </div>
                    ))}
                  </div>
                  {/* Informational */}
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

            {/* Cross-Clause Risks */}
            {fullResult.cross_clause_risks && fullResult.cross_clause_risks.length > 0 && (
              <CollapsibleSection
                id="section-crossclause"
                title="Cross-Clause Risks"
                count={fullResult.cross_clause_risks.length}
                icon={<FileSearch className="w-4 h-4 text-purple-400" />}
                severityCounts={countBySeverity(fullResult.cross_clause_risks)}
                defaultOpen={true}
              >
                {fullResult.cross_clause_risks.map((item, i) => (
                  <FindingCard
                    key={i}
                    severity={item.severity}
                    title={item.clauses_involved.join(' + ')}
                    description={item.risk}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Redline Suggestions */}
            {fullResult.redline_suggestions && fullResult.redline_suggestions.length > 0 && (
              <CollapsibleSection
                id="section-redlines"
                title="Redline Suggestions"
                count={fullResult.redline_suggestions.length}
                defaultOpen={true}
              >
                {[...fullResult.redline_suggestions]
                  .sort((a, b) => {
                    const order = { high: 0, medium: 1, low: 2 };
                    return (order[a.leverage] ?? 2) - (order[b.leverage] ?? 2);
                  })
                  .map((item, i) => (
                    <div key={i} className="finding-high">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {leverageBadge(item.leverage)}
                        <CopyButton text={item.suggested_text} />
                      </div>
                      <p className="text-zinc-500 text-sm line-through mb-1">{item.original_text}</p>
                      <p className="text-emerald-300 text-sm font-medium mb-1">{item.suggested_text}</p>
                      <p className="text-zinc-400 text-xs">{item.reasoning}</p>
                    </div>
                  ))}
              </CollapsibleSection>
            )}

            {/* Industry Benchmarks */}
            {fullResult.industry_benchmarks && fullResult.industry_benchmarks.length > 0 && (
              <BenchmarkChart benchmarks={fullResult.industry_benchmarks} />
            )}

            {/* Red Flags */}
            {fullResult.red_flags.length > 0 && (
              <CollapsibleSection
                id="section-redflags"
                title="Red Flags"
                count={fullResult.red_flags.length}
                icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
                severityCounts={countBySeverity(fullResult.red_flags)}
                defaultOpen={true}
              >
                {fullResult.red_flags.map((flag, i) => (
                  <FindingCard
                    key={i}
                    severity={flag.severity}
                    title={flag.clause}
                    description={flag.risk}
                    recommendation={flag.recommendation}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Missing Clauses */}
            {fullResult.missing_clauses.length > 0 && (
              <CollapsibleSection
                id="section-missing"
                title="Missing Clauses"
                count={fullResult.missing_clauses.length}
                icon={<FileSearch className="w-4 h-4 text-yellow-400" />}
                defaultOpen={true}
              >
                {fullResult.missing_clauses.map((clause, i) => (
                  <FindingCard
                    key={i}
                    severity="medium"
                    title={clause.clause}
                    description={clause.importance}
                    recommendation={clause.recommendation}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Unfavorable Terms */}
            {fullResult.unfavorable_terms.length > 0 && (
              <CollapsibleSection
                id="section-unfavorable"
                title="Unfavorable Terms"
                count={fullResult.unfavorable_terms.length}
                icon={<Scale className="w-4 h-4 text-orange-400" />}
                defaultOpen={true}
              >
                {fullResult.unfavorable_terms.map((term, i) => (
                  <FindingCard
                    key={i}
                    severity="high"
                    title={term.term}
                    description={term.why_unfavorable}
                    recommendation={term.suggestion}
                  />
                ))}
              </CollapsibleSection>
            )}

            {/* Recommendations */}
            {fullResult.recommendations.length > 0 && (
              <div id="section-actions" className="liquid-glass p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <CheckCircle className="w-4 h-4 text-zinc-400" /> Recommended Actions
                </h3>

                {/* DO FIRST */}
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

                {/* Important */}
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

                {/* Nice to Have */}
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
            <div className="text-center text-xs text-zinc-500 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3" /> This is AI-generated analysis only. Not legal advice.</p>
              <p>Always consult a licensed attorney before making legal decisions.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
