import { NextRequest, NextResponse } from 'next/server';
import { getCustomerCredits } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const customerId = request.nextUrl.searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json({ credits: 0 });
    }

    const credits = await getCustomerCredits(customerId);
    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Credits check error:', error);
    return NextResponse.json({ credits: 0 });
  }
}
