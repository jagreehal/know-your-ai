export interface IconEntry {
  filename: string;
  name: string;
}

export const ICONS: IconEntry[] = [
  { filename: 'openai.png', name: 'OpenAI' },
  { filename: 'codex.png', name: 'Codex' },
  { filename: 'claude.png', name: 'Claude' },
  { filename: 'anthropic.png', name: 'Anthropic' },
  { filename: 'google.png', name: 'Google' },
  { filename: 'gemini.png', name: 'Gemini' },
  { filename: 'microsoft.png', name: 'Microsoft' },
  { filename: 'copilot.png', name: 'GitHub Copilot' },
  { filename: 'aws.png', name: 'AWS' },
  { filename: 'azure.png', name: 'Azure' },
  { filename: 'googlecloud.png', name: 'Google Cloud' },
  { filename: 'vertexai.png', name: 'Vertex AI' },
  { filename: 'meta.png', name: 'Meta' },
  { filename: 'metaai.png', name: 'Meta AI' },
  { filename: 'xai.png', name: 'xAI' },
  { filename: 'grok.png', name: 'Grok' },
  { filename: 'mistral.png', name: 'Mistral' },
  { filename: 'cohere.png', name: 'Cohere' },
  { filename: 'huggingface.png', name: 'Hugging Face' },
  { filename: 'stability.png', name: 'Stability AI' },
  { filename: 'midjourney.png', name: 'Midjourney' },
  { filename: 'perplexity.png', name: 'Perplexity' },
  { filename: 'elevenlabs.png', name: 'ElevenLabs' },
  { filename: 'runway.png', name: 'Runway' },
  { filename: 'suno.png', name: 'Suno' },
  { filename: 'sora.png', name: 'Sora' },
  { filename: 'dalle.png', name: 'DALL-E' },
  { filename: 'ideogram.png', name: 'Ideogram' },
  { filename: 'replit.png', name: 'Replit' },
  { filename: 'cursor.png', name: 'Cursor' },
  { filename: 'windsurf.png', name: 'Windsurf' },
  { filename: 'lovable.png', name: 'Lovable' },
  { filename: 'v0.png', name: 'v0' },
  { filename: 'n8n.png', name: 'n8n' },
  { filename: 'langchain.png', name: 'LangChain' },
  { filename: 'langgraph.png', name: 'LangGraph' },
  { filename: 'llamaindex.png', name: 'LlamaIndex' },
  { filename: 'crewai.png', name: 'CrewAI' },
  { filename: 'pydanticai.png', name: 'PydanticAI' },
  { filename: 'openrouter.png', name: 'OpenRouter' },
  { filename: 'together.png', name: 'Together AI' },
  { filename: 'replicate.png', name: 'Replicate' },
  { filename: 'fireworks.png', name: 'Fireworks AI' },
  { filename: 'deepseek.png', name: 'DeepSeek' },
  { filename: 'qwen.png', name: 'Qwen' },
  { filename: 'kimi.png', name: 'Kimi' },
  { filename: 'notebooklm.png', name: 'NotebookLM' },
  { filename: 'vercel.png', name: 'Vercel' },
  { filename: 'cloudflare.png', name: 'Cloudflare' },
  { filename: 'cerebras.png', name: 'Cerebras' },
  { filename: 'sambanova.png', name: 'SambaNova' },
  { filename: 'groq.png', name: 'Groq' },
  { filename: 'ollama.png', name: 'Ollama' },
  { filename: 'openwebui.png', name: 'Open WebUI' },
  { filename: 'langsmith.png', name: 'LangSmith' },
  { filename: 'baseten.png', name: 'Baseten' },
  { filename: 'coqui.png', name: 'Coqui' },
  { filename: 'gradio.png', name: 'Gradio' },
];

const BASE = '/know-your-ai';

export function getIconPath(filename: string): string {
  return `${BASE}/icons/${filename}`;
}

// Mulberry32 seeded PRNG
export function createRng(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function generateSeed(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function shuffleSeeded<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickSeeded<T>(
  array: T[],
  count: number,
  rng: () => number,
): T[] {
  return shuffleSeeded(array, rng).slice(0, count);
}
