import { NextRequest, NextResponse } from 'next/server';
import { extractText, validateFile } from '@/lib/pdf';
import { analyzeContract, getContractPreview } from '@/lib/analyzer';
import { cacheAnalysis } from '@/lib/stripe';
import { randomUUID } from 'crypto';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const validation = validateFile({ size: file.size, type: file.type });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let contractText: string;
    try {
      contractText = await extractText(buffer, file.type);
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      return NextResponse.json(
        { error: 'Could not extract text from file. Please ensure it contains readable text.' },
        { status: 400 }
      );
    }

    if (contractText.length < 100) {
      return NextResponse.json(
        { error: 'Contract text too short. Please upload a complete contract.' },
        { status: 400 }
      );
    }

    // Run full analysis upfront, cache it, return preview to the user
    let preview, fullAnalysis;
    try {
      [preview, fullAnalysis] = await Promise.all([
        getContractPreview(contractText),
        analyzeContract(contractText),
      ]);
    } catch (aiError) {
      const message = aiError instanceof Error ? aiError.message : String(aiError);
      console.error('AI analysis error:', message);
      return NextResponse.json(
        { error: `Analysis failed: ${message}` },
        { status: 500 }
      );
    }

    const analysisId = randomUUID();
    cacheAnalysis(analysisId, fullAnalysis, 'legal');

    return NextResponse.json({
      preview: true,
      analysisId,
      ...preview,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Unhandled analysis error:', message);
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
