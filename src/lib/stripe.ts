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
export const CAVEAT_PRICE_STANDARD = 7900; // $79 in cents

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

export async function createCheckoutSession(
  analysisId: string,
  analysisType: AnalysisType = 'legal'
): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const productName =
    analysisType === 'smart' ? 'Caveat Smart Contract Analysis' : 'Caveat Contract Analysis';
  const productDesc =
    analysisType === 'smart'
      ? 'Full AI-powered smart contract security report'
      : 'Full AI-powered contract risk report';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: productDesc,
          },
          unit_amount: CAVEAT_PRICE_LAUNCH,
        },
        quantity: 1,
      },
    ],
    metadata: {
      analysisId,
      analysisType,
      product: analysisType === 'smart' ? 'caveat-smart-contract-analysis' : 'caveat-contract-analysis',
    },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/analyze`,
  });

  if (!session.url) throw new Error('Failed to create checkout session URL');
  return session.url;
}
