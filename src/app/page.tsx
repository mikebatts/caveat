import Link from 'next/link';
import { Lock, Zap, DollarSign, FileText, Code, ShieldAlert, FileSearch, Scale, Flame, AlertTriangle, ClipboardList, Check, Upload, Cpu, BarChart3, ArrowRight } from '@/components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50 liquid-glass" style={{ borderColor: 'var(--glass-border)', borderRadius: 0 }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono font-bold text-xl tracking-wider text-white">CAVEAT</span>
          <Link
            href="/analyze"
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm shadow-lg shadow-violet-600/25"
          >
            Start Scanning
          </Link>
        </div>
      </header>

      {/* Hero — two-column */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="relative grid md:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}>
              AI-Powered<br />
              <span className="text-violet-400">Contract Intelligence</span>
            </h1>

            <p className="text-xl text-zinc-300 mt-6">
              Scan smart contracts and legal agreements for vulnerabilities, bad terms, and hidden risks &mdash; with redline suggestions and industry benchmarks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/analyze"
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-violet-600/25"
              >
                Start Scanning
              </Link>
              <a
                href="#how-it-works"
                className="border border-zinc-600 hover:border-zinc-400 text-zinc-200 hover:text-white px-6 py-3.5 rounded-xl font-medium transition-colors flex items-center gap-1"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="text-sm text-zinc-400 mt-4">
              No signup required &middot; Your files are never stored &middot; Money-back guarantee
            </p>
          </div>

          {/* Right — sample report card */}
          <div className="relative">
            <div className="liquid-glass-elevated p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 font-medium">SaaS Agreement</span>
                <span className="text-xs text-zinc-500">Just now</span>
              </div>
              <div className="rounded-lg border p-4 mb-4 risk-high">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">Risk Score</p>
                    <p className="text-2xl font-bold">7.2/10</p>
                  </div>
                  <p className="text-sm font-semibold">High Risk</p>
                </div>
              </div>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-start gap-2 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                  <span className="text-zinc-300">Auto-renewal with 90-day notice period locks you in</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                  <span className="text-zinc-300">Unlimited liability clause missing mutual cap</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-yellow-400" />
                  <span className="text-zinc-300">IP assignment broader than industry standard</span>
                </div>
              </div>
              {/* Fade bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-[20px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y py-6" style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-bg)' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-300 font-medium">
          <span className="flex items-center gap-2 text-violet-400 font-semibold">2,100+ contracts analyzed</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-violet-400" /> Privacy-first (never stored)</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" /> 60-second analysis</span>
          <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-violet-400" /> $500 cheaper than a lawyer</span>
          <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-violet-400" /> PDF, DOCX & .sol supported</span>
          <span className="flex items-center gap-2"><Code className="w-4 h-4 text-violet-400" /> Smart Contracts</span>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-white mb-14" style={{ fontFamily: 'var(--font-serif)' }}>
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Upload, title: 'Upload', desc: 'Drag & drop your contract (PDF, DOCX, or .sol)' },
            { icon: Cpu, title: 'AI Scans', desc: '60 seconds scanning for risks & vulnerabilities' },
            { icon: BarChart3, title: 'Get Report', desc: 'Redline suggestions, benchmarks & risk scores' },
            { icon: Check, title: 'Take Action', desc: 'Priority-ranked action items you can act on' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center relative" style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.25)' }}>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <step.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What It Detects */}
      <section className="border-y py-24" style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            What Caveat Detects
          </h2>
          <p className="text-center text-zinc-300 mb-14">
            Smart contracts and legal agreements &mdash; one tool for both
          </p>

          <h3 className="font-semibold text-zinc-200 text-lg mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-violet-500 rounded-full" />
            <Code className="w-5 h-5 text-violet-400" /> Smart Contracts (Solidity)
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              { icon: ShieldAlert, title: 'Vulnerabilities', desc: 'Reentrancy, overflow, unchecked calls, front-running, known exploit matching' },
              { icon: Lock, title: 'Access Control', desc: 'Missing onlyOwner, unprotected functions, architecture review' },
              { icon: Flame, title: 'Gas Optimization', desc: 'Unnecessary storage reads, loop inefficiencies, calldata vs memory' },
              { icon: ClipboardList, title: 'Missing Patterns', desc: 'ReentrancyGuard, Pausable, event emissions, input validation' },
            ].map((item, i) => (
              <div key={i} className="liquid-glass-interactive flex gap-4 p-5">
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-zinc-200 text-lg mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full" />
            <FileText className="w-5 h-5 text-blue-400" /> Legal Contracts
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: AlertTriangle, title: 'Red Flags & Redlines', desc: 'Unfair terms flagged with specific replacement language you can copy-paste' },
              { icon: FileSearch, title: 'Cross-Clause Risks', desc: 'How clauses interact to create hidden risks (e.g., payment + termination traps)' },
              { icon: Scale, title: 'Industry Benchmarks', desc: 'Compare your terms against market standards for your contract type' },
              { icon: Lock, title: 'Priority Action Items', desc: 'DO FIRST / Important / Nice to have — ranked so you know what to fix first' },
            ].map((item, i) => (
              <div key={i} className="liquid-glass-interactive flex gap-4 p-5">
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          See What You Get
        </h2>
        <p className="text-center text-zinc-300 mb-12">
          Every analysis includes actionable intelligence you can use immediately
        </p>

        <div className="relative max-w-2xl mx-auto liquid-glass-elevated p-6 overflow-hidden">
          {/* Contract type badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 font-medium">Freelance Agreement</span>
            <span className="text-xs text-zinc-500">Full Report</span>
          </div>

          {/* Executive summary bullets */}
          <div className="rounded-xl border p-4 mb-4" style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}>
            <h4 className="text-sm font-semibold text-white mb-2">Executive Summary</h4>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 text-sm">
                <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                <span className="text-zinc-300">Payment net-60 is 2x slower than industry standard net-30</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                <span className="text-zinc-300">IP assignment includes background IP — unusually broad</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-emerald-400" />
                <span className="text-zinc-300">Termination clause is mutual and fair</span>
              </div>
            </div>
          </div>

          {/* Redline suggestion */}
          <div className="rounded-xl border p-4 mb-4" style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}>
            <h4 className="text-sm font-semibold text-white mb-2">Redline Suggestion</h4>
            <p className="text-zinc-500 text-sm line-through mb-1">&quot;All work product, including pre-existing materials, shall be owned exclusively by Client.&quot;</p>
            <p className="text-emerald-300 text-sm font-medium">&quot;All work product created specifically for this engagement shall be owned by Client. Contractor retains ownership of pre-existing materials.&quot;</p>
          </div>

          {/* Benchmark row */}
          <div className="rounded-xl border p-4" style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white">Payment Terms</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-800">Below standard</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-zinc-500">Your contract</p>
                <p className="text-zinc-300">Net-60</p>
              </div>
              <div>
                <p className="text-zinc-500">Market standard</p>
                <p className="text-zinc-300">Net-30</p>
              </div>
            </div>
          </div>

          {/* Fade bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent rounded-b-[20px]" />
        </div>

        <div className="text-center mt-8">
          <Link
            href="/analyze"
            className="text-violet-400 hover:text-violet-300 font-medium inline-flex items-center gap-1"
          >
            See what your report looks like <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          Simple Pricing
        </h2>
        <p className="text-center text-zinc-300 mb-14">
          5 analysis credits. No subscriptions. Use anytime.
        </p>

        <div className="max-w-md mx-auto liquid-glass-elevated accent-glow-ring p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            LAUNCH SPECIAL
          </div>

          <p className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
            $49
            <span className="text-xl text-zinc-500 line-through ml-2" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>$79</span>
          </p>
          <p className="text-zinc-300 mt-1">for 5 analyses</p>
          <p className="text-zinc-400 text-sm mt-0.5">Just $9.80 per analysis</p>

          <ul className="text-left mt-6 space-y-3.5 text-base text-zinc-200">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> 5 full analysis credits</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> Redline suggestions with replacement language</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> Cross-clause risk analysis</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> Industry benchmark comparisons</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> Legal contracts + smart contracts</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> Privacy-first (never stored)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-violet-400 flex-shrink-0" /> 14-day money-back guarantee</li>
          </ul>

          <Link
            href="/analyze"
            className="mt-8 block w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-violet-600/25"
          >
            Get 5 Credits &mdash; $49
          </Link>

          <p className="text-amber-400 text-sm font-medium mt-3">
            Only 12 spots left at this price
          </p>
        </div>

        <p className="text-center text-sm text-amber-400/80 font-medium mt-4">
          Price increases to $79 after first 50 customers
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t py-8" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-zinc-400">
          <p className="mb-2 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> <strong>Disclaimer:</strong> Caveat provides AI-generated informational analysis only.
            This is not legal advice or a professional security audit. AI can hallucinate or miss critical issues.
          </p>
          <p>
            Always consult a licensed attorney or professional auditor before making decisions.
            We assume no liability for actions taken based on our analysis.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6" style={{ borderColor: 'var(--glass-border)' }}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-400">
          <span className="font-mono font-bold tracking-wider">CAVEAT</span>
          <span>Built with AI &middot; Powered by OpenAI</span>
        </div>
      </footer>
    </div>
  );
}
