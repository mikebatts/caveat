import { SlitherFinding } from './solidity-analyzer';

export async function runSlither(sourceCode: string): Promise<SlitherFinding[]> {
  const serviceUrl = process.env.SLITHER_SERVICE_URL;
  const apiKey = process.env.SLITHER_API_KEY;

  if (!serviceUrl || !apiKey) {
    throw new Error('Slither service not configured');
  }

  const response = await fetch(`${serviceUrl}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ source_code: sourceCode }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    throw new Error(`Slither service error (${response.status}): ${text}`);
  }

  const data = await response.json();

  // Normalize findings
  const findings: SlitherFinding[] = (data.findings || data.detectors || []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) => ({
      title: f.check || f.title || 'Unknown',
      description: f.description || f.impact || '',
      severity: (f.impact || f.severity || 'informational').toLowerCase(),
      confidence: (f.confidence || 'medium').toLowerCase(),
      location: f.first_markdown_element || f.location || '',
    })
  );

  return findings;
}
