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

  useEffect(() => {
    if (!sessionId) {
      setError('No session found. Please try analyzing your contract again.');
      setLoading(false);
      return;
    }

    fetch(`/api/results?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load results');
        setResult(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load results');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const isSmart = result?.analysisType === 'smart';

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {loading && (
        <div className="text-center py-20">
          <div className="spinner spinner-lg mx-auto mb-4" />
          <p className="text-lg font-semibold text-white">Loading your full report...</p>
          <p className="text-sm text-zinc-400 mt-1">Verifying payment and preparing results</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-white mb-2">Something went wrong</p>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link
            href="/analyze"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Analyze Another Contract
          </Link>
        </div>
      )}

      {result && (
        <div>
          <div className="rounded-xl p-6 mb-8 text-center" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-lg font-semibold text-emerald-400">Payment successful!</p>
            <p className="text-sm text-emerald-400/70 mt-1">
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
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              ← Analyze another contract
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: 'var(--border)', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-xl tracking-wider text-white">
            CAVEAT
          </Link>
          <span className="text-sm text-zinc-500">AI Contract Intelligence</span>
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
      <footer className="border-t py-6 mt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" /> AI-generated analysis only. Not legal advice. Not a security audit. Consult appropriate professionals.
        </div>
      </footer>
    </div>
  );
}
