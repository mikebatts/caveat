import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-xl text-gray-900">Caveat</span>
          </div>
          <Link
            href="/analyze"
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
          >
            Analyze a Contract
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Upload Any Contract<br />
          <span className="text-amber-500">→ AI Risk Report</span> in 60 Seconds
        </h1>

        <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
          Flags bad terms, missing clauses & overpayments — for $49 launch price.
          Cheaper than one lawyer call.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-amber-500/25"
          >
            Analyze My Contract — $49
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            See how it works →
          </a>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          No signup required · Your contract is never stored · 14-day money-back guarantee
        </p>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-gray-100 bg-white py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span>🔒 Privacy-first (never stored)</span>
          <span>⚡ 60-second analysis</span>
          <span>💰 $500 cheaper than a lawyer</span>
          <span>📄 PDF & DOCX supported</span>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: '📄', title: 'Upload', desc: 'Drag & drop your contract (PDF or DOCX)' },
            { icon: '🤖', title: 'AI Analyzes', desc: '60 seconds scanning for risks & gaps' },
            { icon: '📊', title: 'Get Report', desc: 'Clear risk score + detailed flags' },
            { icon: '✅', title: 'Take Action', desc: 'Share with lawyer or renegotiate' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What It Catches */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Caveat Catches
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🚩', title: 'Red Flags', desc: 'One-sided liability, hidden fees, unfair penalties, auto-renewal traps' },
              { icon: '📝', title: 'Missing Clauses', desc: 'Force majeure, limitation of liability, dispute resolution, IP ownership' },
              { icon: '⚖️', title: 'Unfavorable Terms', desc: 'Non-compete overreach, broad indemnification, unilateral termination rights' },
              { icon: '🔒', title: 'Compliance Notes', desc: 'Potential regulatory issues, jurisdiction conflicts, employment law risks' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-200 hover:border-amber-300 transition-colors">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Simple Pricing
        </h2>
        <p className="text-center text-gray-600 mb-12">
          One-time payment. No subscriptions. Lifetime access.
        </p>

        <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-amber-500 p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            LAUNCH SPECIAL
          </div>

          <p className="text-5xl font-bold text-gray-900">$49</p>
          <p className="text-gray-500 mt-1">one-time · lifetime access</p>

          <ul className="text-left mt-6 space-y-3 text-sm text-gray-700">
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited contract analyses</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Full risk reports with recommendations</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> PDF & DOCX support</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 60-second analysis time</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Privacy-first (never stored)</li>
            <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 14-day money-back guarantee</li>
          </ul>

          <Link
            href="/analyze"
            className="mt-8 block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Get Started — $49
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Price increases to $79 after first 50 customers
        </p>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-gray-400">
          <p className="mb-2">
            ⚠️ <strong>Disclaimer:</strong> Caveat provides AI-generated informational analysis only.
            This is not legal advice. AI can hallucinate or miss jurisdiction-specific nuances.
          </p>
          <p>
            Always consult a licensed attorney before making legal decisions. We assume no liability
            for actions taken based on our analysis.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <span>🏛️ Caveat</span>
          <span>Built with AI · Powered by OpenAI</span>
        </div>
      </footer>
    </div>
  );
}
