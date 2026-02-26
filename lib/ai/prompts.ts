export function buildCreativePrompt(params: {
  brand: any;
  description: string;
  platform: string;
  objective: string;
  tone: string;
  language: string;
  format: string;
  cta: string;
}) {
  const { brand, description, platform, objective, tone, language, format, cta } = params;

  return `
You are a senior ads designer. Create a clean, premium, tech-style ad image.
Brand: PRISMA (agency premium). Dark background, controlled neon gradient accents.
Palette: ${JSON.stringify(brand?.paletteJson ?? {})}
Typography: ${JSON.stringify(brand?.typographyJson ?? {})}
Layout: safe margins, high readability, minimal clutter, strong hierarchy.

Platform: ${platform}
Objective: ${objective}
Tone: ${tone}
Language: ${language}
Format: ${format}

User request: ${description}

Rules:
- No watermark.
- No tiny unreadable text.
- Use short headline + optional small subtext.
- Leave breathing space.
- Include CTA idea visually: "${cta}" (can be subtle).
`.trim();
}

export function buildCopyPrompt(params: {
  description: string;
  platform: string;
  objective: string;
  tone: string;
  language: string;
  cta: string;
}) {
  const { description, platform, objective, tone, language, cta } = params;

  return `
Write ad copy for a local PMI audience.
Return STRICT JSON with keys: headline, primary, cta, hooks (array of 5).
Language: ${language}
Platform: ${platform}
Objective: ${objective}
Tone: ${tone}
CTA must be exactly: "${cta}"

Brief: ${description}
`.trim();
}
