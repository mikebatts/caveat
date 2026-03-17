import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export const CAVIAT_PRICE_LAUNCH = 4900; // $49 in cents
export const CAVIAT_PRICE_STANDARD = 7900; // $79 in cents
export const CAVIAT_LAUNCH_LIMIT = 50;

export async function getLaunchPrice(): Promise<number> {
  // Check how many payments have been made
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 1,
  });
  // In production, track actual count in DB
  // For MVP, we'll use a simple file counter or just default to launch price
  return CAVIAT_PRICE_LAUNCH;
}

export async function createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      product: 'caveat-contract-analysis',
    },
  });
}
