import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canGenerateAi } from "@/lib/rbac";
import { buildCopyPrompt, buildCreativePrompt } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session as any).role;
  if (!canGenerateAi(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, description, platform, objective, tone, language, cta, formats } = body as {
    title: string;
    description: string;
    platform: string;
    objective: string;
    tone: string;
    language: string;
    cta: string;
    formats: string[];
  };

  const preset = await prisma.brandPreset.findFirst({ where: { isDefault: true } });

  const project = await prisma.aiProject.create({
    data: {
      title,
      description,
      platform,
      objective,
      tone,
      language,
      formats,
      brandPresetId: preset?.id ?? null,
      createdById: (session as any).uid
    }
  });

  const apiKey = process.env.OPENAI_API_KEY;

  // No key => mock variants so UI works
  if (!apiKey) {
    await prisma.aiVariant.create({
      data: {
        aiProjectId: project.id,
        type: "copy",
        promptUsed: "MOCK_NO_KEY",
        copyJson: {
          headline: "Creatività pronta in 1 click",
          primary: "Descrivi l’offerta e genera subito post e ads coerenti con PRISMA.",
          cta,
          hooks: ["Più clienti", "Meno caos", "Brand premium", "Follow-up rapidi", "Risultati misurabili"]
        }
      }
    });

    for (const f of formats) {
      await prisma.aiVariant.create({
        data: {
          aiProjectId: project.id,
          type: "image",
          format: f,
          imageUrl: `https://placehold.co/${f}/png?text=PRISMA+${encodeURIComponent(f)}`,
          promptUsed: "MOCK_NO_KEY"
        }
      });
    }

    return NextResponse.json({ id: project.id });
  }

  // Copy generation (live)
  const copyPrompt = buildCopyPrompt({ description, platform, objective, tone, language, cta });

  const copyRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a precise marketing copywriter. Output valid JSON only." },
        { role: "user", content: copyPrompt }
      ],
      temperature: 0.8
    })
  });

  if (!copyRes.ok) {
    const t = await copyRes.text();
    return NextResponse.json({ error: `OpenAI error: ${t}` }, { status: 500 });
  }

  const copyJsonText = (await copyRes.json()).choices?.[0]?.message?.content ?? "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(copyJsonText);
  } catch {
    parsed = { raw: copyJsonText };
  }

  await prisma.aiVariant.create({
    data: {
      aiProjectId: project.id,
      type: "copy",
      promptUsed: copyPrompt,
      copyJson: parsed
    }
  });

  // Image variants placeholder (keeps architecture stable)
  for (const f of formats) {
    const imgPrompt = buildCreativePrompt({
      brand: preset,
      description,
      platform,
      objective,
      tone,
      language,
      format: f,
      cta
    });

    await prisma.aiVariant.create({
      data: {
        aiProjectId: project.id,
        type: "image",
        format: f,
        imageUrl: `https://placehold.co/${f}/png?text=AI+IMAGE+TODO`,
        promptUsed: imgPrompt,
        meta: { provider: "placeholder" }
      }
    });
  }

  return NextResponse.json({ id: project.id });
}
