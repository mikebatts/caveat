import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, AnalysisType } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { analysisId, analysisType } = await request.json() as {
      analysisId?: string;
      analysisType?: AnalysisType;
    };

    if (!analysisId) {
      return NextResponse.json({ error: 'Missing analysisId' }, { status: 400 });
    }

    const url = await createCheckoutSession(analysisId, analysisType || 'legal');

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
