import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) { console.log('GEMINI_KEY_NOT_CONFIGURED'); process.exit(1); }
try {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { timeout: 20_000 } });
  const response = await ai.models.generateContent({ model: process.argv[2] || process.env.GEMINI_MODEL, contents: 'Responda apenas OK.', config: { maxOutputTokens: 32 } });
  console.log(response.text ? 'GEMINI_CONNECTION_OK' : 'GEMINI_EMPTY_RESPONSE');
} catch (error) {
  const status = Number(error?.status) || 'unavailable';
  const reason = /API key not valid|API_KEY_INVALID|invalid api key/i.test(error?.message || '') ? 'INVALID_API_KEY' : /quota|RESOURCE_EXHAUSTED/i.test(error?.message || '') ? 'QUOTA_OR_BILLING' : 'REQUEST_REJECTED';
  console.log(`GEMINI_CONNECTION_FAILED status=${status} reason=${reason}`);
  process.exitCode = 1;
}
