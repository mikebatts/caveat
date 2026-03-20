import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCachedAnalysis, grantCreditsIdempotent, CREDITS_PER_PACK } from '@/lib/stripe';

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

    const customerId = session.customer as string | null;

    // Credit pack purchase — grant credits idempotently and return balance
    if (session.metadata?.product === 'caveat-credit-pack') {
      const credits = parseInt(session.metadata?.credits || String(CREDITS_PER_PACK), 10);
      if (customerId) {
        const { balance } = await grantCreditsIdempotent(customerId, session.id, credits);
        return NextResponse.json({
          creditPurchase: true,
          customerId,
          credits: balance,
        });
      }
      return NextResponse.json({
        creditPurchase: true,
        customerId,
      });
    }

    const analysisId = session.metadata?.analysisId;
    const analysisType = session.metadata?.analysisType || 'legal';

    if (!analysisId) {
      return NextResponse.json({ error: 'No analysis linked to this session' }, { status: 404 });
    }

    // Try in-memory cache (works if same serverless instance)
    const cached = getCachedAnalysis(analysisId);
    if (cached) {
      return NextResponse.json({
        preview: false,
        analysisType: cached.analysisType,
        customerId,
        ...cached.data,
      });
    }

    // Cache miss (different serverless instance) — tell client to use sessionStorage
    return NextResponse.json({
      paymentVerified: true,
      analysisId,
      analysisType,
      customerId,
      useClientCache: true,
    });
  } catch (error) {
    console.error('Results error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve results' },
      { status: 500 }
    );
  }
}
