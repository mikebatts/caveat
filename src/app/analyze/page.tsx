'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code, FileText, AlertTriangle } from '@/components/Icons';
import UploadZone from '@/components/UploadZone';
import AnalysisReport from '@/components/AnalysisReport';
import SmartContractInput from '@/components/SmartContractInput';
import SmartContractReport from '@/components/SmartContractReport';
import { ContractAnalysis, PreviewResult } from '@/lib/analyzer';
import { SmartContractAnalysis, SmartContractPreviewResult } from '@/lib/solidity-analyzer';

type AnalysisTab = 'legal' | 'smart';
type LegalResult = (ContractAnalysis | PreviewResult) & { preview: boolean; analysisId?: string };
type SmartResult = (SmartContractAnalysis | SmartContractPreviewResult) & { preview: boolean; analysisId?: string; analysisType?: string };

export default function AnalyzePage() {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('smart');
  const [legalResult, setLegalResult] = useState<LegalResult | null>(null);
  const [smartResult, setSmartResult] = useState<SmartResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const result = activeTab === 'legal' ? legalResult : smartResult;

  const handleTabSwitch = (tab: AnalysisTab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setLegalResult(null);
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

      setLegalResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSmartAnalyze = (data: Record<string, unknown>) => {
    setSmartResult(data as unknown as SmartResult);
    setIsAnalyzing(false);
  };

  const handleUnlock = async () => {
    const currentResult = activeTab === 'legal' ? legalResult : smartResult;
    if (!currentResult?.analysisId) return;
    setIsRedirecting(true);
    setError(null);

    try {
      // Persist full analysis to sessionStorage before Stripe redirect
      // (in-memory server cache won't survive across serverless instances)
      const fullData = (currentResult as unknown as Record<string, unknown>)._fullData;
      if (fullData && currentResult.analysisId) {
        try {
          sessionStorage.setItem(
            `caveat_analysis_${currentResult.analysisId}`,
            JSON.stringify({ fullData, analysisType: activeTab })
          );
        } catch {
          // sessionStorage unavailable — will fall back to server cache
        }
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId: currentResult.analysisId,
          analysisType: activeTab,
        }),
      });

      const { url, error: checkoutError } = await res.json();

      if (!url) throw new Error(checkoutError || 'Failed to create checkout');

      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setIsRedirecting(false);
    }
  };

  const handleReset = () => {
    if (activeTab === 'legal') {
      setLegalResult(null);
    } else {
      setSmartResult(null);
    }
    setError(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: 'var(--border)', background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold text-xl tracking-wider text-white">
            CAVEAT
          </Link>
          <span className="text-sm text-zinc-400">AI Contract Intelligence</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {!result && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Analyze Your Contract
            </h1>
            <p className="text-zinc-400">
              {activeTab === 'legal'
                ? 'Upload a PDF or DOCX to get an instant AI risk report'
                : 'Upload Solidity code for an instant AI security report'}
            </p>
          </div>
        )}

        {/* Tabs */}
        {!result && (
          <div className="flex gap-1 rounded-xl p-1 mb-8 max-w-md mx-auto" style={{ background: 'var(--surface)' }}>
            <button
              onClick={() => handleTabSwitch('smart')}
              disabled={isAnalyzing}
              className={`flex-1 text-sm font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'smart'
                  ? 'bg-cyan-900/50 text-cyan-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Code className="w-4 h-4" /> Smart Contract
            </button>
            <button
              onClick={() => handleTabSwitch('legal')}
              disabled={isAnalyzing}
              className={`flex-1 text-sm font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'legal'
                  ? 'bg-cyan-900/50 text-cyan-300'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <FileText className="w-4 h-4" /> Legal Contract
            </button>
          </div>
        )}

        {/* Legal Tab Input */}
        {activeTab === 'legal' && !legalResult && (
          <UploadZone onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
        )}

        {/* Smart Contract Tab Input */}
        {activeTab === 'smart' && !smartResult && (
          <SmartContractInput
            onAnalyze={handleSmartAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl p-4 text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p className="text-red-400 flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</p>
            <button
              onClick={handleReset}
              className="text-red-400 underline text-sm mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            <button
              onClick={handleReset}
              className="text-sm text-zinc-500 hover:text-zinc-300 mb-4 inline-flex items-center gap-1"
            >
              ← Analyze another contract
            </button>

            {activeTab === 'legal' && legalResult && (
              <AnalysisReport result={legalResult} onUnlock={handleUnlock} />
            )}

            {activeTab === 'smart' && smartResult && (
              <SmartContractReport result={smartResult} onUnlock={handleUnlock} />
            )}

            {isRedirecting && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="rounded-xl p-8 text-center max-w-sm mx-4" style={{ background: 'var(--surface-raised)' }}>
                  <div className="spinner spinner-lg mx-auto mb-4" />
                  <p className="font-semibold text-white">Redirecting to checkout...</p>
                  <p className="text-sm text-zinc-400 mt-1">You&apos;ll be taken to Stripe to complete payment</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Disclaimer */}
      <footer className="border-t py-6 mt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" /> AI-generated analysis only. Not legal advice. Not a security audit. Consult appropriate professionals.
        </div>
      </footer>
    </div>
  );
}
