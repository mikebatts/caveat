'use client';

import { useState } from 'react';
import Link from 'next/link';
import UploadZone from '@/components/UploadZone';
import AnalysisReport from '@/components/AnalysisReport';
import { ContractAnalysis, PreviewResult } from '@/lib/analyzer';

type AnalysisResult = (ContractAnalysis | PreviewResult) & { preview: boolean };

export default function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUnlock = async () => {
    if (!selectedFile) return;
    setIsPaying(true);
    setError(null);

    try {
      // Create payment intent
      const checkoutRes = await fetch('/api/checkout', { method: 'POST' });
      const { clientSecret } = await checkoutRes.json();

      if (!clientSecret) throw new Error('Failed to create payment');

      // In production, load Stripe.js and confirm payment
      // For now, simulate payment confirmation
      // TODO: Integrate @stripe/stripe-js for real payment flow
      // const stripe = await loadStripe(publishableKey);
      // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, ...);

      // Placeholder: In production, this would be the actual Stripe confirmation
      alert('Payment flow: In production, this opens Stripe checkout.\n\nFor MVP testing, use Stripe test mode.');

      // After successful payment, re-analyze with paymentIntentId
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // formData.append('paymentIntentId', paymentIntent.id);
      // const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      // const data = await response.json();
      // setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsPaying(false);
    }
  };

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

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {!result && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analyze Your Contract
            </h1>
            <p className="text-gray-600">
              Upload a PDF or DOCX to get an instant AI risk report
            </p>
          </div>
        )}

        {/* Upload Zone */}
        {!result && (
          <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => { setError(null); setResult(null); setSelectedFile(null); }}
              className="text-red-600 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <button
              onClick={() => { setResult(null); setSelectedFile(null); }}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
            >
              ← Analyze another contract
            </button>

            <AnalysisReport result={result} onUnlock={handleUnlock} />

            {isPaying && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="font-semibold text-gray-900">Processing payment...</p>
                  <p className="text-sm text-gray-500 mt-1">This will just take a moment</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Disclaimer */}
      <footer className="border-t border-gray-100 py-6 mt-12">
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-gray-400">
          <p>⚠️ AI-generated analysis only. Not legal advice. Consult a licensed attorney.</p>
        </div>
      </footer>
    </div>
  );
}
