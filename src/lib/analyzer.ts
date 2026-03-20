import { openai, ANALYSIS_MODEL } from './openai';

export interface ContractAnalysis {
  overall_risk_score: number; // 1-10, 10 = highest risk
  contract_type: string;
  summary: string;
  executive_summary: Array<{ point: string; action_required: boolean }>;
  red_flags: Array<{
    clause: string;
    risk: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }>;
  missing_clauses: Array<{
    clause: string;
    importance: string;
    recommendation: string;
  }>;
  unfavorable_terms: Array<{
    term: string;
    why_unfavorable: string;
    suggestion: string;
  }>;
  cross_clause_risks: Array<{
    clauses_involved: string[];
    risk: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  redline_suggestions: Array<{
    original_text: string;
    suggested_text: string;
    reasoning: string;
    leverage: 'high' | 'medium' | 'low';
  }>;
  industry_benchmarks: Array<{
    term: string;
    your_contract: string;
    market_standard: string;
    assessment: 'standard' | 'below_standard' | 'above_standard';
  }>;
  compliance_notes: Array<{
    issue: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  recommendations: Array<{
    action: string;
    priority: 'do_first' | 'important' | 'nice_to_have';
  }>;
}

export interface PreviewResult {
  summary: string;
  risk_score: number;
  red_flag_count: number;
  top_risks: string[];
}

const ANALYSIS_SYSTEM_PROMPT = `You are Caveat, an AI contract analyzer. You help freelancers, small business owners, and founders understand the risks in their contracts.

STEP 1: Detect the contract type (e.g., "Freelancer Service Agreement", "SaaS Terms of Service", "NDA", "Employment Agreement", "Licensing Agreement").

STEP 2: Analyze the contract and return a JSON response with this structure:

{
  "overall_risk_score": <1-10, where 10 is extremely risky>,
  "contract_type": "<detected contract type>",
  "summary": "<2-3 sentence plain English summary of the contract and key concerns>",
  "executive_summary": [
    { "point": "<actionable bullet point a non-lawyer can act on immediately>", "action_required": true/false }
  ],
  "red_flags": [
    {
      "clause": "<exact clause or section reference>",
      "risk": "<what the risk is>",
      "severity": "low|medium|high|critical",
      "recommendation": "<what to do about it>"
    }
  ],
  "missing_clauses": [
    {
      "clause": "<what's missing>",
      "importance": "<why it matters>",
      "recommendation": "<what to add>"
    }
  ],
  "unfavorable_terms": [
    {
      "term": "<the one-sided term>",
      "why_unfavorable": "<explanation>",
      "suggestion": "<how to negotiate>"
    }
  ],
  "cross_clause_risks": [
    {
      "clauses_involved": ["<clause 1>", "<clause 2>"],
      "risk": "<how these clauses interact to create risk — e.g., net-90 payment + 30-day termination = unpaid work risk>",
      "severity": "low|medium|high|critical"
    }
  ],
  "redline_suggestions": [
    {
      "original_text": "<exact problematic language from the contract>",
      "suggested_text": "<specific replacement language you'd propose>",
      "reasoning": "<why this change matters>",
      "leverage": "high|medium|low"
    }
  ],
  "industry_benchmarks": [
    {
      "term": "<key term being compared>",
      "your_contract": "<what this contract says>",
      "market_standard": "<what's typical for this contract type>",
      "assessment": "standard|below_standard|above_standard"
    }
  ],
  "compliance_notes": [
    {
      "issue": "<potential regulatory issue>",
      "severity": "info|warning|critical"
    }
  ],
  "recommendations": [
    { "action": "<actionable recommendation>", "priority": "do_first|important|nice_to_have" }
  ]
}

IMPORTANT:
- Begin with 3-5 executive summary bullet points a non-lawyer can act on immediately
- Be specific about clause references
- Use plain English, not legal jargon
- Flag payment terms, liability, IP ownership, termination, non-compete, indemnification
- Check for missing standard protections (limitation of liability, force majeure, dispute resolution)
- Cross-clause correlation: examine how clauses interact — e.g., net-90 payment + 30-day termination = unpaid work risk
- Redline suggestions: for each unfavorable term, provide specific alternative language. Rate negotiation leverage (high = they'll likely accept, medium = worth asking, low = long shot)
- Industry benchmarks: compare key terms against market standards for this contract type
- Priority-rank recommendations: do_first = act before signing, important = negotiate if possible, nice_to_have = minor improvement
- Rate risk honestly: 1-3 = low, 4-6 = moderate, 7-8 = high, 9-10 = critical
- If the contract is ambiguous, note it as a risk
- Consider both parties' interests, but prioritize the person uploading (likely the weaker party)

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

const PREVIEW_SYSTEM_PROMPT = `You are Caveat, an AI contract analyzer. Read the provided contract and return a brief preview (NOT the full analysis).

Return ONLY this JSON structure:
{
  "summary": "<2-3 sentence plain English summary>",
  "risk_score": <1-10 overall risk>,
  "red_flag_count": <number of potential issues you spotted>,
  "top_risks": ["<risk 1>", "<risk 2>", "<risk 3>"]
}

Be brief. This is a preview — save the detail for the paid analysis. Respond ONLY with valid JSON.`;

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const response = await openai.chat.completions.create({
    model: ANALYSIS_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: `Please analyze this contract:\n\n${contractText}` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No analysis returned');

  return JSON.parse(content) as ContractAnalysis;
}

export async function getContractPreview(contractText: string): Promise<PreviewResult> {
  const response = await openai.chat.completions.create({
    model: ANALYSIS_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: PREVIEW_SYSTEM_PROMPT },
      { role: 'user', content: `Give me a preview of this contract:\n\n${contractText}` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No preview returned');

  return JSON.parse(content) as PreviewResult;
}
