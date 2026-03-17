import { openai, ANALYSIS_MODEL } from './openai';

export interface ContractAnalysis {
  overall_risk_score: number; // 1-10, 10 = highest risk
  summary: string;
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
  compliance_notes: Array<{
    issue: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  recommendations: string[];
}

export interface PreviewResult {
  summary: string;
  risk_score: number;
  red_flag_count: number;
  top_risks: string[];
}

const ANALYSIS_SYSTEM_PROMPT = `You are Caveat, an AI contract analyzer. You help freelancers, small business owners, and founders understand the risks in their contracts.

Analyze the provided contract and return a JSON response with the following structure:

{
  "overall_risk_score": <1-10, where 10 is extremely risky>,
  "summary": "<2-3 sentence plain English summary of the contract and key concerns>",
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
  "compliance_notes": [
    {
      "issue": "<potential regulatory issue>",
      "severity": "info|warning|critical"
    }
  ],
  "recommendations": ["<actionable recommendation>", "..."]
}

IMPORTANT:
- Be specific about clause references
- Use plain English, not legal jargon
- Flag payment terms, liability, IP ownership, termination, non-compete, indemnification
- Check for missing standard protections (limitation of liability, force majeure, dispute resolution)
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
