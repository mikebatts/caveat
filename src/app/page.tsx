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
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Start Scanning
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }} />
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            AI-Powered<br />
            <span className="text-cyan-400">Contract Intelligence</span>
          </h1>

          <p className="text-xl text-zinc-400 mt-6 max-w-2xl mx-auto">
            Scan smart contracts and legal agreements for vulnerabilities, bad terms, and hidden risks — in 60 seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-4 rounded-xl transition-colors text-lg cta-glow"
            >
              Start Scanning
            </Link>
            <a
              href="#how-it-works"
              className="text-zinc-400 hover:text-white font-medium transition-colors flex items-center gap-1"
            >
              See how it works <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-sm text-zinc-500 mt-4">
            No signup required · Your files are never stored · Money-back guarantee
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y py-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400">
          <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Privacy-first (never stored)</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> 60-second analysis</span>
          <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> $500 cheaper than a lawyer</span>
          <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> PDF, DOCX & .sol supported</span>
          <span className="flex items-center gap-2"><Code className="w-4 h-4" /> Smart Contracts</span>
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
            { icon: BarChart3, title: 'Get Report', desc: 'Clear risk score + detailed flags' },
            { icon: Check, title: 'Take Action', desc: 'Share with lawyer or fix your code' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                <step.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-zinc-400">{step.desc}</p>
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
          <p className="text-center text-zinc-400 mb-12">
            Smart contracts and legal agreements — one tool for both
          </p>

          <h3 className="font-semibold text-cyan-400 text-lg mb-4 flex items-center gap-2"><Code className="w-5 h-5" /> Smart Contracts (Solidity)</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { icon: ShieldAlert, title: 'Vulnerabilities', desc: 'Reentrancy, overflow, unchecked calls, front-running, oracle manipulation' },
              { icon: Lock, title: 'Access Control', desc: 'Missing onlyOwner, unprotected functions, tx.origin usage, centralization risks' },
              { icon: Flame, title: 'Gas Optimization', desc: 'Unnecessary storage reads, loop inefficiencies, calldata vs memory' },
              { icon: ClipboardList, title: 'Missing Patterns', desc: 'ReentrancyGuard, Pausable, event emissions, input validation' },
            ].map((item, i) => (
              <div key={i} className="glass-card gradient-border flex gap-4 p-5 rounded-xl transition-colors">
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-emerald-400 text-lg mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Legal Contracts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: AlertTriangle, title: 'Red Flags', desc: 'One-sided liability, hidden fees, unfair penalties, auto-renewal traps' },
              { icon: FileSearch, title: 'Missing Clauses', desc: 'Force majeure, limitation of liability, dispute resolution, IP ownership' },
              { icon: Scale, title: 'Unfavorable Terms', desc: 'Non-compete overreach, broad indemnification, unilateral termination rights' },
              { icon: Lock, title: 'Compliance Notes', desc: 'Potential regulatory issues, jurisdiction conflicts, employment law risks' },
            ].map((item, i) => (
              <div key={i} className="glass-card flex gap-4 p-5 rounded-xl border transition-colors" style={{ borderColor: 'var(--border)' }}>
                <div className="flex-shrink-0">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Simple Pricing
        </h2>
        <p className="text-center text-zinc-400 mb-12">
          One-time payment. No subscriptions. Lifetime access.
        </p>

        <div className="max-w-md mx-auto glass-card gradient-border rounded-2xl p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            LAUNCH SPECIAL
          </div>

          <p className="text-5xl font-bold text-white">$49</p>
          <p className="text-zinc-400 mt-1">per analysis · lifetime access</p>

          <ul className="text-left mt-6 space-y-3 text-sm text-zinc-300">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Full risk reports with recommendations</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Legal contracts (PDF & DOCX)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Smart contracts (Solidity .sol)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> 60-second analysis time</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> Privacy-first (never stored)</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> 14-day money-back guarantee</li>
          </ul>

          <Link
            href="/analyze"
            className="mt-8 block w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-lg transition-colors cta-glow"
          >
            Get Started — $49
          </Link>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Price increases to $79 after first 50 customers
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-zinc-500">
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
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-zinc-500">
          <span className="font-mono font-bold tracking-wider">CAVEAT</span>
          <span>Built with AI · Powered by OpenAI</span>
        </div>
      </footer>
    </div>
  );
}
