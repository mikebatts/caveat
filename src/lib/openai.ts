import OpenAI from 'openai';

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return (getOpenAI() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const ANALYSIS_MODEL = 'gpt-4o';
