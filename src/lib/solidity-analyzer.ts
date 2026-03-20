import { openai, ANALYSIS_MODEL } from './openai';

export interface SmartContractAnalysis {
  overall_risk_score: number;
  summary: string;
  vulnerabilities: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    recommendation: string;
    source: 'slither' | 'ai' | 'both';
  }>;
  gas_issues: Array<{
    description: string;
    location: string;
    severity: 'info' | 'low' | 'medium';
    suggestion: string;
  }>;
  access_control: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }>;
  missing_patterns: Array<{
    pattern: string;
    importance: string;
    recommendation: string;
  }>;
  compliance_notes: Array<{
    issue: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
  recommendations: string[];
}

export interface SmartContractPreviewResult {
  summary: string;
  risk_score: number;
  vulnerability_count: number;
  top_risks: string[];
}

export interface SlitherFinding {
  title: string;
  description: string;
  severity: string;
  confidence: string;
  location: string;
}

const SOLIDITY_ANALYSIS_SYSTEM_PROMPT = `You are Caveat, a senior smart contract security auditor AI. You analyze Solidity smart contracts for vulnerabilities, gas optimizations, and best practice violations.

You may also receive Slither static analysis findings. Cross-reference these with your own analysis — confirm, expand, or note false positives.

Analyze the provided Solidity source code and return a JSON response with this structure:

{
  "overall_risk_score": <1-10, where 10 is extremely risky>,
  "summary": "<2-3 sentence plain English summary of the contract and key security concerns>",
  "vulnerabilities": [
    {
      "title": "<vulnerability name>",
      "description": "<what the issue is>",
      "severity": "low|medium|high|critical",
      "location": "<function name or line range>",
      "recommendation": "<how to fix>",
      "source": "slither|ai|both"
    }
  ],
  "gas_issues": [
    {
      "description": "<gas inefficiency>",
      "location": "<function or line>",
      "severity": "info|low|medium",
      "suggestion": "<optimization>"
    }
  ],
  "access_control": [
    {
      "issue": "<access control concern>",
      "severity": "low|medium|high|critical",
      "recommendation": "<fix>"
    }
  ],
  "missing_patterns": [
    {
      "pattern": "<e.g. ReentrancyGuard, Pausable, Ownable>",
      "importance": "<why it matters>",
      "recommendation": "<what to add>"
    }
  ],
  "compliance_notes": [
    {
      "issue": "<ERC standard compliance, license, etc.>",
      "severity": "info|warning|critical"
    }
  ],
  "recommendations": ["<actionable recommendation>", "..."]
}

IMPORTANT:
- Check for: reentrancy, access control issues, integer overflow/underflow, unchecked external calls, front-running, oracle manipulation, flash loan attacks, delegatecall risks, storage collisions, tx.origin usage
- Check for missing: ReentrancyGuard, Pausable, access control (Ownable/AccessControl), event emissions, input validation
- Check gas: unnecessary storage reads, loop optimizations, calldata vs memory
- If Slither findings are provided, mark confirmed issues as "both", new AI-found issues as "ai", and Slither-only issues as "slither"
- Use plain English — target audience is developers, not auditors
- Rate risk honestly: 1-3 = low, 4-6 = moderate, 7-8 = high, 9-10 = critical

Respond ONLY with valid JSON. No markdown, no explanation outside the JSON.`;

const SOLIDITY_PREVIEW_SYSTEM_PROMPT = `You are Caveat, a smart contract security auditor AI. Read the provided Solidity code and return a brief preview (NOT the full analysis).

Return ONLY this JSON structure:
{
  "summary": "<2-3 sentence plain English summary of the contract and its security posture>",
  "risk_score": <1-10 overall risk>,
  "vulnerability_count": <number of potential security issues you spotted>,
  "top_risks": ["<risk 1>", "<risk 2>", "<risk 3>"]
}

Be brief. This is a preview — save the detail for the paid analysis. Respond ONLY with valid JSON.`;

export async function analyzeSmartContract(
  sourceCode: string,
  slitherFindings: SlitherFinding[] | null
): Promise<SmartContractAnalysis> {
  let userMessage = `Please analyze this Solidity smart contract:\n\n${sourceCode}`;

  if (slitherFindings && slitherFindings.length > 0) {
    userMessage += `\n\n--- Slither Static Analysis Findings ---\n${JSON.stringify(slitherFindings, null, 2)}`;
  }

  const response = await openai.chat.completions.create({
    model: ANALYSIS_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: SOLIDITY_ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No analysis returned');

  return JSON.parse(content) as SmartContractAnalysis;
}

export async function getSmartContractPreview(
  sourceCode: string
): Promise<SmartContractPreviewResult> {
  const response = await openai.chat.completions.create({
    model: ANALYSIS_MODEL,
    temperature: 0.1,
    messages: [
      { role: 'system', content: SOLIDITY_PREVIEW_SYSTEM_PROMPT },
      { role: 'user', content: `Give me a security preview of this smart contract:\n\n${sourceCode}` },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No preview returned');

  return JSON.parse(content) as SmartContractPreviewResult;
}
