import Link from 'next/link';
import { Lock, Zap, DollarSign, FileText, Code, ShieldAlert, FileSearch, Scale, Flame, AlertTriangle, ClipboardList, Check, Upload, Cpu, BarChart3, ArrowRight } from '@/components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: 'var(--border)', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-mono font-bold text-xl tracking-wider text-white">CAVEAT</span>
          <Link
            href="/analyze"
            className="bg-white hover:bg-zinc-200 text-black font-medium px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Start Scanning
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            AI-Powered<br />
            <span className="text-white">Contract Intelligence</span>
          </h1>

          <p className="text-xl text-zinc-300 mt-6 max-w-2xl mx-auto">
            Scan smart contracts and legal agreements for vulnerabilities, bad terms, and hidden risks &mdash; with redline suggestions and industry benchmarks.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
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
      </section>

      {/* Trust Bar */}
      <section className="border-y py-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-300 font-medium">
          <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-zinc-400" /> Privacy-first (never stored)</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-zinc-400" /> 60-second analysis</span>
          <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-zinc-400" /> $500 cheaper than a lawyer</span>
          <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-zinc-400" /> PDF, DOCX & .sol supported</span>
          <span className="flex items-center gap-2"><Code className="w-4 h-4 text-zinc-400" /> Smart Contracts</span>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
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
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)' }}>
                <step.icon className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What It Detects */}
      <section className="border-y py-20" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            What Caveat Detects
          </h2>
          <p className="text-center text-zinc-300 mb-12">
            Smart contracts and legal agreements &mdash; one tool for both
          </p>

          <h3 className="font-semibold text-zinc-200 text-lg mb-4 flex items-center gap-2"><Code className="w-5 h-5" /> Smart Contracts (Solidity)</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: ShieldAlert, title: 'Vulnerabilities', desc: 'Reentrancy, overflow, unchecked calls, front-running, known exploit matching' },
              { icon: Lock, title: 'Access Control', desc: 'Missing onlyOwner, unprotected functions, architecture review' },
              { icon: Flame, title: 'Gas Optimization', desc: 'Unnecessary storage reads, loop inefficiencies, calldata vs memory' },
              { icon: ClipboardList, title: 'Missing Patterns', desc: 'ReentrancyGuard, Pausable, event emissions, input validation' },
            ].map((item, i) => (
              <div key={i} className="glass-card flex gap-4 p-5 rounded-xl transition-colors">
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-zinc-200 text-lg mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Legal Contracts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: AlertTriangle, title: 'Red Flags & Redlines', desc: 'Unfair terms flagged with specific replacement language you can copy-paste' },
              { icon: FileSearch, title: 'Cross-Clause Risks', desc: 'How clauses interact to create hidden risks (e.g., payment + termination traps)' },
              { icon: Scale, title: 'Industry Benchmarks', desc: 'Compare your terms against market standards for your contract type' },
              { icon: Lock, title: 'Priority Action Items', desc: 'DO FIRST / Important / Nice to have — ranked so you know what to fix first' },
            ].map((item, i) => (
              <div key={i} className="glass-card flex gap-4 p-5 rounded-xl transition-colors">
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-zinc-400" />
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

      {/* Mid-page CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Link
          href="/analyze"
          className="bg-white hover:bg-zinc-200 text-black font-semibold px-8 py-4 rounded-xl transition-colors text-lg inline-block"
        >
          Scan Your Contract Now
        </Link>
        <p className="text-sm text-zinc-400 mt-3">60-second analysis &middot; No signup required</p>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Simple Pricing
        </h2>
        <p className="text-center text-zinc-300 mb-12">
          5 analysis credits. No subscriptions. Use anytime.
        </p>

        <div className="max-w-md mx-auto glass-card rounded-2xl p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
            LAUNCH SPECIAL
          </div>

          <p className="text-5xl font-bold text-white">$49</p>
          <p className="text-zinc-300 mt-1">for 5 analyses</p>
          <p className="text-zinc-400 text-sm mt-0.5">Just $9.80 per analysis</p>

          <ul className="text-left mt-6 space-y-3.5 text-base text-zinc-200">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> 5 full analysis credits</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> Redline suggestions with replacement language</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> Cross-clause risk analysis</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> Industry benchmark comparisons</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> Legal contracts + smart contracts</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> Privacy-first (never stored)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-zinc-400 flex-shrink-0" /> 14-day money-back guarantee</li>
          </ul>

          <Link
            href="/analyze"
            className="mt-8 block w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            Get 5 Credits &mdash; $49
          </Link>
        </div>

        <p className="text-center text-sm text-zinc-300 font-medium mt-4">
          Price increases to $79 after first 50 customers
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
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
      <footer className="border-t py-6" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-400">
          <span className="font-mono font-bold tracking-wider">CAVEAT</span>
          <span>Built with AI &middot; Powered by OpenAI</span>
        </div>
      </footer>
    </div>
  );
}
