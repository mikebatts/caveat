'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnalysisReport from '@/components/AnalysisReport';
import { ContractAnalysis } from '@/lib/analyzer';

type FullResult = ContractAnalysis & { preview: boolean };

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

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {loading && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">⏳</div>
          <p className="text-lg font-semibold text-gray-900">Loading your full report...</p>
          <p className="text-sm text-gray-500 mt-1">Verifying payment and preparing results</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/analyze"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Analyze Another Contract
          </Link>
        </div>
      )}

      {result && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-lg font-semibold text-green-800">Payment successful!</p>
            <p className="text-sm text-green-600 mt-1">Here&apos;s your full contract analysis</p>
          </div>

          <AnalysisReport result={result} onUnlock={() => {}} />

          <div className="mt-8 text-center">
            <Link
              href="/analyze"
              className="text-amber-600 hover:text-amber-700 font-medium"
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-xl text-gray-900">Caveat</span>
          </Link>
          <span className="text-sm text-gray-500">AI Contract Analyzer</span>
        </div>
      </header>

      <Suspense fallback={
        <main className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-lg font-semibold text-gray-900">Loading...</p>
          </div>
        </main>
      }>
        <SuccessContent />
      </Suspense>

      {/* Disclaimer */}
      <footer className="border-t border-gray-100 py-6 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-gray-400">
          <p>⚠️ AI-generated analysis only. Not legal advice. Consult a licensed attorney.</p>
        </div>
      </footer>
    </div>
  );
}
