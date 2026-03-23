'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, AlertTriangle } from '@/components/Icons';
import AnalysisReport from '@/components/AnalysisReport';
import SmartContractReport from '@/components/SmartContractReport';
import { ContractAnalysis } from '@/lib/analyzer';
import { SmartContractAnalysis } from '@/lib/solidity-analyzer';

type FullResult = (ContractAnalysis | SmartContractAnalysis) & {
  preview: boolean;
  analysisType?: 'legal' | 'smart';
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [result, setResult] = useState<FullResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditsPurchased, setCreditsPurchased] = useState(false);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session found. Please try analyzing your contract again.');
      setLoading(false);
      return;
    }

    // Retrieve customer ID from session and store it
    fetch(`/api/results?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load results');

        // Store customer ID from the session
        if (data.customerId) {
          localStorage.setItem('caveat_customer_id', data.customerId);
        }

        // Credit pack purchase — no analysis to show
        if (data.creditPurchase) {
          setCreditsPurchased(true);
          if (typeof data.credits === 'number') {
            setCreditBalance(data.credits);
          }
          return;
        }

        // If server returned full data from cache, use it directly
        if (!data.useClientCache) {
          setResult(data);
          return;
        }

        // Server cache missed (serverless instance mismatch) — restore from sessionStorage
        const analysisId = data.analysisId;
        const stored = sessionStorage.getItem(`caveat_analysis_${analysisId}`);
        if (!stored) {
          throw new Error('Analysis expired. Please re-upload your contract for a new analysis.');
        }

        const { fullData, analysisType } = JSON.parse(stored);
        const fullAnalysis = JSON.parse(atob(fullData));
        sessionStorage.removeItem(`caveat_analysis_${analysisId}`);

        setResult({
          preview: false,
          analysisType,
          ...fullAnalysis,
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const isSmart = result?.analysisType === 'smart';

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
      {loading && (
        <div className="text-center py-20">
          <div className="spinner spinner-lg mx-auto mb-4" />
          <p className="text-lg font-semibold text-white">Processing your payment...</p>
          <p className="text-sm text-zinc-400 mt-1">Verifying payment and preparing your credits</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-white mb-2">Something went wrong</p>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link
            href="/analyze"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Analyze Another Contract
          </Link>
        </div>
      )}

      {creditsPurchased && (
        <div className="text-center py-20">
          <div className="liquid-glass-elevated rounded-xl p-6 mb-8 inline-block" style={{ background: '#0f2922', border: '1px solid #166534' }}>
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-semibold text-emerald-400">Payment successful!</p>
            <p className="text-sm text-emerald-300 mt-1">You have {creditBalance ?? 5} analysis credit{(creditBalance ?? 5) !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <Link
              href="/analyze"
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors inline-block"
            >
              Start Analyzing &rarr;
            </Link>
          </div>
        </div>
      )}

      {result && (
        <div>
          <div className="liquid-glass-elevated rounded-xl p-6 mb-8 text-center" style={{ background: '#0f2922', border: '1px solid #166534' }}>
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-semibold text-emerald-400">Payment successful!</p>
            <p className="text-sm text-emerald-300 mt-1">
              Here&apos;s your full {isSmart ? 'smart contract security' : 'contract'} analysis
            </p>
          </div>

          {isSmart ? (
            <SmartContractReport result={result as SmartContractAnalysis & { preview: boolean }} onUnlock={() => {}} />
          ) : (
            <AnalysisReport result={result as ContractAnalysis & { preview: boolean }} onUnlock={() => {}} />
          )}

          <div className="mt-8 text-center">
            <Link
              href="/analyze"
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              &larr; Analyze another contract
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen">
      {/* Ambient floating blobs (subtle) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-blob w-[300px] h-[300px] bg-violet-600/8 top-[10%] left-[20%]" />
        <div className="ambient-blob w-[250px] h-[250px] bg-emerald-500/6 top-[40%] right-[10%]" style={{ animationDelay: '-8s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-white/15 sticky top-0 z-50 liquid-glass" style={{ borderRadius: 0 }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-xl tracking-wider text-white">
            CAVEAT
          </Link>
          <span className="text-sm text-zinc-400">AI Contract Intelligence</span>
        </div>
      </header>

      <Suspense fallback={
        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="spinner spinner-lg mx-auto mb-4" />
            <p className="text-lg font-semibold text-white">Loading...</p>
          </div>
        </main>
      }>
        <SuccessContent />
      </Suspense>

      {/* Disclaimer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" /> AI-generated analysis only. Not legal advice. Not a security audit. Consult appropriate professionals.
        </div>
      </footer>
    </div>
  );
}
