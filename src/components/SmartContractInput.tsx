'use client';

import { useState, useCallback } from 'react';
import { Code, Download } from '@/components/Icons';

type InputMode = 'upload' | 'paste' | 'address';

interface SmartContractInputProps {
  onAnalyze: (result: Record<string, unknown>) => void;
  isAnalyzing: boolean;
  customerId?: string | null;
}

export default function SmartContractInput({ onAnalyze, isAnalyzing: externalAnalyzing, customerId }: SmartContractInputProps) {
  const [mode, setMode] = useState<InputMode>('upload');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalAnalyzing, setInternalAnalyzing] = useState(false);

  const isAnalyzing = externalAnalyzing || internalAnalyzing;

  const handleSubmit = async (body: FormData | object) => {
    setError(null);
    setInternalAnalyzing(true);
    try {
      const isFormData = body instanceof FormData;

      // Add customerId to requests
      if (customerId) {
        if (isFormData) {
          (body as FormData).append('customerId', customerId);
        } else {
          (body as Record<string, unknown>).customerId = customerId;
        }
      }

      const response = await fetch('/api/analyze-smart', {
        method: 'POST',
        ...(isFormData
          ? { body: body as FormData }
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }
      onAnalyze(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setInternalAnalyzing(false);
    }
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.sol')) {
        setError('Please upload a .sol file');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      handleSubmit(formData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const tabs: { key: InputMode; label: string }[] = [
    { key: 'upload', label: 'Upload .sol' },
    { key: 'paste', label: 'Paste Code' },
    { key: 'address', label: 'Contract Address' },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-lg p-1 liquid-glass">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); setError(null); }}
            disabled={isAnalyzing}
            className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
              mode === tab.key
                ? 'bg-violet-600/20 text-violet-400'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload .sol */}
      {mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-300
            ${isDragging
              ? 'border-violet-500 scale-[1.02] liquid-glass-elevated'
              : 'border-zinc-700 hover:border-violet-500/50 liquid-glass'
            }
            ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
          `}
          style={{
            background: isDragging ? 'rgba(124, 58, 237, 0.08)' : 'var(--glass-bg)',
          }}
        >
          <input
            type="file"
            accept=".sol"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isAnalyzing}
          />
          <div className="space-y-4">
            <div className="flex justify-center">
              {isAnalyzing ? (
                <div className="spinner spinner-lg" />
              ) : isDragging ? (
                <Download className="w-12 h-12 text-zinc-400" />
              ) : (
                <Code className="w-12 h-12 text-zinc-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-100">
                {isAnalyzing ? 'Analyzing smart contract...' : isDragging ? 'Drop your .sol file here' : 'Upload a Solidity file'}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                {isAnalyzing ? 'This usually takes 30-60 seconds' : 'Drag & drop or click to select a .sol file'}
              </p>
            </div>
            {!isAnalyzing && (
              <p className="text-xs text-zinc-500">Max 500KB &middot; Your code is never stored</p>
            )}
          </div>
        </div>
      )}

      {/* Paste Code */}
      {mode === 'paste' && (
        <div className="space-y-3">
          {isAnalyzing ? (
            <div className="border-2 border-dashed border-violet-500/30 rounded-2xl p-12 text-center">
              <div className="spinner spinner-lg mx-auto mb-4" />
              <p className="text-lg font-semibold text-zinc-100">Analyzing smart contract...</p>
              <p className="text-sm text-zinc-400 mt-1">This usually takes 30-60 seconds</p>
            </div>
          ) : (
            <>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;// Paste your Solidity code here..."
                className="w-full h-64 p-4 rounded-xl border font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-100 placeholder-zinc-600"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              />
              <button
                onClick={() => handleSubmit({ source_code: code })}
                disabled={!code.trim()}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Analyze Smart Contract
              </button>
            </>
          )}
        </div>
      )}

      {/* Contract Address */}
      {mode === 'address' && (
        <div className="space-y-3">
          {isAnalyzing ? (
            <div className="border-2 border-dashed border-violet-500/30 rounded-2xl p-12 text-center">
              <div className="spinner spinner-lg mx-auto mb-4" />
              <p className="text-lg font-semibold text-zinc-100">Fetching & analyzing contract...</p>
              <p className="text-sm text-zinc-400 mt-1">This usually takes 30-60 seconds</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-4 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent text-zinc-100 placeholder-zinc-600"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                />
              </div>
              <p className="text-xs text-zinc-500">
                Enter a verified contract address on Ethereum mainnet. Source will be fetched from Etherscan.
              </p>
              <button
                onClick={() => handleSubmit({ contract_address: address })}
                disabled={!address.trim()}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Fetch & Analyze
              </button>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
