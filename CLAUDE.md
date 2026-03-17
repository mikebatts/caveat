# CLAUDE.md — Caveat

## Project Overview
**Caveat** — AI-powered contract analyzer. Upload a contract (PDF/DOCX), get a risk report in 60 seconds. Flags unfavorable terms, missing clauses, overpayment risks, and compliance issues.

**Tagline:** "Upload Any Contract → AI Risk Report in 60 Seconds"
**Pricing:** $79 lifetime (launch special: $49 first 50 customers)
**Target:** Freelancers, small business owners, founders, content creators
**Goal:** $5,000 revenue in first 7 days (~63 sales @ $79 avg)

## Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Payments:** Stripe (one-time payments via Payment Intents)
- **AI:** OpenAI API (GPT-4o for contract analysis)
- **PDF Parsing:** pdf-parse
- **Hosting:** Vercel
- **File Storage:** In-memory (MVP) — no persistent storage of contracts

## Project Structure
```
caveat/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── analyze/page.tsx      # Upload & analyze page
│   │   ├── success/page.tsx      # Payment success page
│   │   ├── api/
│   │   │   ├── analyze/route.ts  # Contract analysis endpoint
│   │   │   ├── checkout/route.ts # Stripe checkout creation
│   │   │   └── webhook/route.ts  # Stripe webhook handler
│   │   └── layout.tsx            # Root layout
│   ├── lib/
│   │   ├── stripe.ts             # Stripe client config
│   │   ├── openai.ts             # OpenAI client config
│   │   ├── analyzer.ts           # Contract analysis logic
│   │   └── pdf.ts                # PDF text extraction
│   └── components/
│       ├── UploadZone.tsx        # Drag & drop file upload
│       ├── AnalysisReport.tsx    # Risk report display
│       └── PricingCard.tsx       # Pricing component
├── CLAUDE.md                     # This file
├── README.md                     # Project readme
└── .env.example                  # Environment variable template
```

## Key Design Decisions
1. **No contract storage** — Process in-memory, return report, discard. Privacy-first.
2. **One-time payment** — No subscriptions at launch. Simple Stripe Payment Intents.
3. **Disclaimer-first** — "Not legal advice" prominent everywhere.
4. **Speed over depth** — 60-second target. Report is scannable, not exhaustive.
5. **Mobile-friendly** — Freelancers check contracts on phones.

## AI Analysis Prompt Structure
The analyzer prompt should return JSON with:
- `overall_risk_score` (1-10, 10 = highest risk)
- `summary` (2-3 sentence plain English summary)
- `red_flags` (array of {clause, risk, severity, recommendation})
- `missing_clauses` (array of standard clauses not found)
- `unfavorable_terms` (array of one-sided terms)
- `compliance_notes` (array of potential regulatory issues)
- `recommendations` (array of action items)

## Payment Flow
1. User uploads contract → frontend extracts text
2. Frontend calls `/api/analyze` → returns lightweight preview (summary + risk score)
3. Paywall: "Unlock full report for $49/$79"
4. `/api/checkout` creates Stripe Payment Intent
5. On success → full analysis + detailed report displayed
6. `/api/webhook` confirms payment, logs transaction

## Environment Variables
```
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Launch Checklist
- [ ] Landing page with hero, demo video embed, sample report
- [ ] Upload flow (drag & drop + file picker)
- [ ] PDF/DOCX text extraction working
- [ ] AI analysis returning structured JSON
- [ ] Report display (scannable, mobile-friendly)
- [ ] Stripe checkout flow (test mode → live)
- [ ] Webhook confirming payments
- [ ] Disclaimer on every page
- [ ] Deploy to Vercel
- [ ] Custom domain (trycaveat.com)
- [ ] Product Hunt listing ready
- [ ] Reddit/X post copy ready

## Revenue Targets
- **Launch week:** $5,000 (~63 sales @ $79 or ~100 sales @ $49)
- **Month 1:** $10,000+
- **Month 3:** Introduce subscription tier ($19/mo unlimited)

## Don't
- Don't store contracts after analysis (privacy risk)
- Don't claim to provide legal advice
- Don't add subscriptions at launch (keep it simple)
- Don't build enterprise features yet (focus on individual users)
- Don't optimize for SEO yet (social/PH launch only)
