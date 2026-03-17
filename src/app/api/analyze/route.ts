import { NextRequest, NextResponse } from 'next/server';
import { extractText, validateFile } from '@/lib/pdf';
import { analyzeContract, getContractPreview } from '@/lib/analyzer';
import { stripe } from '@/lib/stripe';

export const maxDuration = 60; // 60 second timeout

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const paymentIntentId = formData.get('paymentIntentId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile({ size: file.size, type: file.type });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Extract text from file
    const buffer = Buffer.from(await file.arrayBuffer());
    let contractText: string;
    try {
      contractText = await extractText(buffer, file.type);
    } catch (error) {
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

    // If no payment, return preview only
    if (!paymentIntentId) {
      const preview = await getContractPreview(contractText);
      return NextResponse.json({
        preview: true,
        ...preview,
      });
    }

    // Verify payment
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { error: 'Payment not completed' },
          { status: 402 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid payment' },
        { status: 402 }
      );
    }

    // Full analysis
    const analysis = await analyzeContract(contractText);
    return NextResponse.json({
      preview: false,
      ...analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
