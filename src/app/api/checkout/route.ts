import { NextRequest, NextResponse } from 'next/server';
import { createCreditPackCheckout } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json() as {
      customerId?: string;
    };

    const { url, customerId: newCustomerId } = await createCreditPackCheckout(customerId);

    return NextResponse.json({ url, customerId: newCustomerId });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
