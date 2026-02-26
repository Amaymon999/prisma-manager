"use client";

import { useState } from "react";
import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formats = ["1080x1080", "1080x1350", "1080x1920", "1200x628", "1920x1080"];

export default function AiNewPage() {
  const [title, setTitle] = useState("Promo - Lead Generation");
  const [description, setDescription] = useState("Post per Facebook per acquisire contatti: sito + ads + follow-up. Stile PRISMA premium.");
  const [platform, setPlatform] = useState("Facebook");
  const [objective, setObjective] = useState("Lead");
  const [tone, setTone] = useState("Diretto");
  const [language, setLanguage] = useState("IT");
  const [cta, setCta] = useState("Scrivici su WhatsApp");
  const [selected, setSelected] = useState<string[]>(["1080x1080", "1200x628"]);
  const [loading, setLoading] = useState(false);

  function toggleFormat(f: string) {
    setSelected((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, description, platform, objective, tone, language, cta, formats: selected })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Errore AI");
      toast.success("Creatività generata");
      window.location.href = `/ai/${json.id}`;
    } catch (e: any) {
      toast.error(e.message ?? "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Nuova creatività</h1>
          <p className="text-sm text-white/60">Descrivi, scegli formato e genera immagini + copy.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brief</CardTitle>
            <CardDescription>Generazione: copy live con OPENAI_API_KEY, immagini placeholder (per ora).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo progetto" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="grid gap-3 md:grid-cols-3">
              <Input value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform" />
              <Input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Objective" />
              <Input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Tone" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
              <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="CTA" />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFormat(f)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selected.includes(f) ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Button onClick={generate} disabled={loading || selected.length === 0}>
                {loading ? "Genero..." : "Genera (immagini + copy)"}
              </Button>
            </div>

            <div className="text-xs text-white/50">
              Se non hai <code>OPENAI_API_KEY</code>, salva varianti mock e funziona uguale.
            </div>
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
