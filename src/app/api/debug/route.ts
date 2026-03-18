import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    openAIPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) || 'NOT SET',
    hasStripe: !!process.env.STRIPE_SECRET_KEY,
    stripePrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL || 'not set',
  });
}
