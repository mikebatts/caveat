import Stripe from 'stripe';
import { ContractAnalysis } from './analyzer';
import { SmartContractAnalysis } from './solidity-analyzer';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover',
  });
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const CAVEAT_PRICE_LAUNCH = 4900; // $49 in cents
export const CREDITS_PER_PACK = 5;

export type AnalysisType = 'legal' | 'smart';

// In-memory analysis cache (TTL 15 minutes)
const analysisCache = new Map<
  string,
  { data: ContractAnalysis | SmartContractAnalysis; analysisType: AnalysisType; expiresAt: number }
>();

export function cacheAnalysis(
  analysisId: string,
  data: ContractAnalysis | SmartContractAnalysis,
  analysisType: AnalysisType = 'legal'
) {
  const expiresAt = Date.now() + 15 * 60 * 1000;
  analysisCache.set(analysisId, { data, expiresAt, analysisType });
}

export function getCachedAnalysis(
  analysisId: string
): { data: ContractAnalysis | SmartContractAnalysis; analysisType: AnalysisType } | null {
  cleanupExpired();
  const entry = analysisCache.get(analysisId);
  if (!entry) return null;
  return { data: entry.data, analysisType: entry.analysisType };
}

function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of analysisCache) {
    if (now > entry.expiresAt) analysisCache.delete(key);
  }
}

export async function createCreditPackCheckout(customerId?: string): Promise<{ url: string; customerId: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Create or reuse Stripe customer
  let customer: Stripe.Customer;
  if (customerId) {
    customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    if (customer.deleted) {
      customer = await stripe.customers.create({ metadata: { credits: '0' } });
    }
  } else {
    customer = await stripe.customers.create({ metadata: { credits: '0' } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customer.id,
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Caveat Analysis Credits',
            description: `${CREDITS_PER_PACK} full AI contract analysis credits`,
          },
          unit_amount: CAVEAT_PRICE_LAUNCH,
        },
        quantity: 1,
      },
    ],
    metadata: {
      product: 'caveat-credit-pack',
      credits: String(CREDITS_PER_PACK),
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/analyze`,
  });

  if (!session.url) throw new Error('Failed to create checkout session URL');
  return { url: session.url, customerId: customer.id };
}

export async function getCustomerCredits(customerId: string): Promise<number> {
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  if (customer.deleted) return 0;
  return parseInt(customer.metadata?.credits || '0', 10);
}

export async function decrementCredits(customerId: string): Promise<number> {
  const current = await getCustomerCredits(customerId);
  if (current <= 0) throw new Error('No credits remaining');
  const newBalance = current - 1;
  await stripe.customers.update(customerId, {
    metadata: { credits: String(newBalance) },
  });
  return newBalance;
}

export async function addCredits(customerId: string, amount: number): Promise<number> {
  const current = await getCustomerCredits(customerId);
  const newBalance = current + amount;
  await stripe.customers.update(customerId, {
    metadata: { credits: String(newBalance) },
  });
  return newBalance;
}
