import { NextRequest, NextResponse } from 'next/server';
import { analyzeSmartContract, getSmartContractPreview } from '@/lib/solidity-analyzer';
import { fetchContractSource } from '@/lib/etherscan';
import { runSlither } from '@/lib/slither';
import { cacheAnalysis, getCustomerCredits, decrementCredits } from '@/lib/stripe';
import { randomUUID } from 'crypto';

export const maxDuration = 60;

function validateSolidity(code: string): string | null {
  if (!code || code.trim().length === 0) {
    return 'No source code provided';
  }
  if (code.length > 500 * 1024) {
    return 'Source code exceeds 500KB limit';
  }
  if (!code.includes('pragma solidity') && !code.includes('SPDX-License-Identifier')) {
    return 'This does not appear to be valid Solidity code. Expected pragma solidity or SPDX-License-Identifier.';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    let sourceCode: string;
    let customerId: string | null = null;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // File upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      customerId = formData.get('customerId') as string | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      if (!file.name.endsWith('.sol')) {
        return NextResponse.json({ error: 'Only .sol files are accepted' }, { status: 400 });
      }
      sourceCode = await file.text();
    } else {
      // JSON body
      const body = await request.json();
      customerId = body.customerId || null;

      if (body.contract_address) {
        // Fetch from Etherscan
        try {
          sourceCode = await fetchContractSource(body.contract_address);
        } catch (err) {
          return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Failed to fetch contract source' },
            { status: 400 }
          );
        }
      } else if (body.source_code) {
        sourceCode = body.source_code;
      } else {
        return NextResponse.json(
          { error: 'Provide source_code, contract_address, or upload a .sol file' },
          { status: 400 }
        );
      }
    }

    // Validate
    const validationError = validateSolidity(sourceCode);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if user has credits
    let hasCredits = false;
    if (customerId) {
      try {
        const credits = await getCustomerCredits(customerId);
        hasCredits = credits > 0;
      } catch {
        hasCredits = false;
      }
    }

    if (hasCredits && customerId) {
      // Full analysis — deduct credit
      const slitherFindings = await Promise.race([
        runSlither(sourceCode).catch(() => null),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 25000)),
      ]);

      const fullAnalysis = await analyzeSmartContract(sourceCode, slitherFindings);
      const remaining = await decrementCredits(customerId);

      return NextResponse.json({
        preview: false,
        analysisType: 'smart',
        creditsRemaining: remaining,
        ...fullAnalysis,
      });
    }

    // Free preview tier
    const slitherPromise = Promise.race([
      runSlither(sourceCode).catch(() => null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 25000)),
    ]);

    const [slitherFindings, preview] = await Promise.all([
      slitherPromise,
      getSmartContractPreview(sourceCode),
    ]);

    // Run full analysis with Slither results
    const fullAnalysis = await analyzeSmartContract(sourceCode, slitherFindings);

    // Cache result
    const analysisId = randomUUID();
    cacheAnalysis(analysisId, fullAnalysis, 'smart');

    // Encode full analysis for client-side persistence (survives Stripe redirect)
    const _fullData = Buffer.from(JSON.stringify(fullAnalysis)).toString('base64');

    return NextResponse.json({
      preview: true,
      analysisId,
      analysisType: 'smart',
      _fullData,
      ...preview,
    });
  } catch (error) {
    console.error('Smart contract analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
