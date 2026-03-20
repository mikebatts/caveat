import { NextRequest, NextResponse } from 'next/server';
import { stripe, grantCreditsIdempotent, CREDITS_PER_PACK } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      if (customerId && session.metadata?.product === 'caveat-credit-pack') {
        const credits = parseInt(session.metadata?.credits || String(CREDITS_PER_PACK), 10);
        const { granted, balance } = await grantCreditsIdempotent(customerId, session.id, credits);
        console.log(`Credits ${granted ? 'granted' : 'already processed'}: ${credits} to ${customerId}, balance: ${balance}`);
      }

      console.log(`Checkout completed: ${session.id}, amount: ${session.amount_total}`);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}, amount: ${paymentIntent.amount}`);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
