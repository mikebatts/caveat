# Caveat 🏛️

**Upload Any Contract → AI Risk Report in 60 Seconds**

Caveat analyzes contracts using AI and flags potential risks, unfavorable terms, missing clauses, and compliance issues. Built for freelancers, small businesses, and founders who can't afford $500/hour lawyers.

![Caveat Screenshot](public/screenshot.png)

## Features

- **Instant Analysis** — Upload PDF or DOCX, get a comprehensive risk report in 60 seconds
- **Red Flag Detection** — Identifies unfavorable terms, hidden fees, and one-sided clauses
- **Missing Clause Alerts** — Flags standard protections that are absent from your contract
- **Compliance Notes** — Warns of potential regulatory issues
- **Risk Scoring** — 1-10 overall risk score for quick assessment
- **Plain English** — No legal jargon, just clear recommendations
- **Privacy First** — Contracts processed in-memory and never stored

## How It Works

1. **Upload** — Drag & drop your contract (PDF or DOCX)
2. **Preview** — Get a free summary + risk score
3. **Pay** — Unlock the full detailed report ($49 launch / $79 standard)
4. **Review** — Scan red flags, missing clauses, and recommendations
5. **Act** — Share with your lawyer or renegotiate with confidence

## Pricing

- **Launch Special:** $49 lifetime (first 50 customers)
- **Standard:** $79 lifetime
- One-time payment, no subscriptions

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **AI:** OpenAI GPT-4o
- **Payments:** Stripe
- **PDF Parsing:** pdf-parse
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Stripe account (for payments)

### Installation

```bash
# Clone the repo
git clone https://github.com/mikebatts/caveat.git
cd caveat

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your API keys
```

### Environment Variables

```env
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Development

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## API Routes

### POST `/api/analyze`
Analyze a contract. Returns preview (summary + risk score) for free, full report after payment.

**Request:**
```
FormData: { file: File, paymentIntentId?: string }
```

**Response:**
```json
{
  "preview": true,
  "summary": "This employment contract contains...",
  "risk_score": 7,
  "red_flag_count": 4
}
```

### POST `/api/checkout`
Create a Stripe Payment Intent for unlocking the full report.

**Response:**
```json
{
  "clientSecret": "pi_...",
  "amount": 4900,
  "currency": "usd"
}
```

### POST `/api/webhook`
Stripe webhook handler. Confirms payments and logs transactions.

## Disclaimer

**This is AI-generated informational analysis only. Not legal advice.**

Caveat uses AI to identify potential risks in contracts, but AI can hallucinate or miss jurisdiction-specific nuances. Always consult a licensed attorney before making legal decisions. We assume no liability for actions taken based on our analysis.

See [LICENSE](LICENSE) for full terms.

## Contributing

This is a commercial product. For bug reports or feature requests, please open an issue.

## License

Proprietary. All rights reserved.

---

**Built with 🏛️ by [Mike](https://github.com/mikebatts)**
