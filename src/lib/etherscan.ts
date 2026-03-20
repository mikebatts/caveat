// Token bucket rate limiter for Etherscan free tier (5 req/sec)
const tokenBucket = {
  tokens: 5,
  maxTokens: 5,
  refillRate: 5, // tokens per second
  lastRefill: Date.now(),
};

function refillTokens() {
  const now = Date.now();
  const elapsed = (now - tokenBucket.lastRefill) / 1000;
  tokenBucket.tokens = Math.min(
    tokenBucket.maxTokens,
    tokenBucket.tokens + elapsed * tokenBucket.refillRate
  );
  tokenBucket.lastRefill = now;
}

async function acquireToken(): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt++) {
    refillTokens();
    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1;
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Too many contract lookups. Please wait a moment and try again.');
}

// LRU cache for contract source code (immutable once verified)
const ADDRESS_CACHE_MAX = 100;
const ADDRESS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  source: string;
  timestamp: number;
}

const addressCache = new Map<string, CacheEntry>();

function getCached(address: string): string | null {
  const entry = addressCache.get(address);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ADDRESS_CACHE_TTL) {
    addressCache.delete(address);
    return null;
  }
  // Move to end for LRU
  addressCache.delete(address);
  addressCache.set(address, entry);
  return entry.source;
}

function setCache(address: string, source: string) {
  // Evict oldest if at capacity
  if (addressCache.size >= ADDRESS_CACHE_MAX) {
    const oldest = addressCache.keys().next().value!;
    addressCache.delete(oldest);
  }
  addressCache.set(address, { source, timestamp: Date.now() });
}

export async function fetchContractSource(address: string): Promise<string> {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    throw new Error('ETHERSCAN_API_KEY is not configured');
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address format');
  }

  // Check cache first
  const cached = getCached(address.toLowerCase());
  if (cached) return cached;

  // Rate limit before making the API call
  await acquireToken();

  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== '1' || !data.result || data.result.length === 0) {
    throw new Error('Failed to fetch contract from Etherscan');
  }

  const result = data.result[0];

  if (!result.SourceCode || result.SourceCode === '') {
    throw new Error(
      'Contract source code is not verified on Etherscan. Only verified contracts can be analyzed.'
    );
  }

  // Handle multi-file source format (wrapped in {{ }})
  let sourceCode = result.SourceCode;
  if (sourceCode.startsWith('{{')) {
    try {
      // Remove outer {{ }} wrapper
      const inner = sourceCode.slice(1, -1);
      const parsed = JSON.parse(inner);
      // Concatenate all source files
      const sources = parsed.sources || parsed;
      const files = Object.values(sources) as Array<{ content: string }>;
      sourceCode = files.map((f) => f.content).join('\n\n');
    } catch {
      // If parsing fails, use as-is
    }
  } else if (sourceCode.startsWith('{')) {
    try {
      const parsed = JSON.parse(sourceCode);
      const sources = parsed.sources || parsed;
      const files = Object.values(sources) as Array<{ content: string }>;
      sourceCode = files.map((f) => f.content).join('\n\n');
    } catch {
      // If parsing fails, use as-is
    }
  }

  // Cache the result
  setCache(address.toLowerCase(), sourceCode);

  return sourceCode;
}
