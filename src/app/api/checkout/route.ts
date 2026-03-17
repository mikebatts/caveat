import { NextResponse } from 'next/server';
import { createPaymentIntent, getLaunchPrice } from '@/lib/stripe';

export async function POST() {
  try {
    const amount = await getLaunchPrice();
    const paymentIntent = await createPaymentIntent(amount);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
