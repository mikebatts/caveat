import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCachedAnalysis } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    // Verify payment via Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const analysisId = session.metadata?.analysisId;
    if (!analysisId) {
      return NextResponse.json({ error: 'No analysis linked to this session' }, { status: 404 });
    }

    const analysis = getCachedAnalysis(analysisId);
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis expired. Please re-upload your contract for a new analysis.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      preview: false,
      ...analysis,
    });
  } catch (error) {
    console.error('Results error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve results' },
      { status: 500 }
    );
  }
}
