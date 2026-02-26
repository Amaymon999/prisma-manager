import { prisma } from "@/lib/db";
import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AiDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.aiProject.findUnique({
    where: { id: params.id },
    include: { variants: { orderBy: { createdAt: "desc" } } }
  });

  if (!project) return <div className="text-white/70">Not found</div>;

  const copies = project.variants.filter((v) => v.type === "copy");
  const images = project.variants.filter((v) => v.type === "image");

  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <p className="text-sm text-white/60">{project.platform} • {project.objective} • {project.tone}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.formats.map((f) => <Badge key={f}>{f}</Badge>)}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Copy</CardTitle>
            <CardDescription>JSON strutturato: headline, primary, cta, hooks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {copies.map((c) => (
              <pre key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs overflow-auto">
{JSON.stringify(c.copyJson, null, 2)}
              </pre>
            ))}
            {copies.length === 0 ? <div className="text-sm text-white/60">Nessun copy disponibile.</div> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Immagini</CardTitle>
            <CardDescription>Varianti per formato.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60 mb-2">{img.format ?? "—"}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.imageUrl ?? ""} alt="variant" className="w-full rounded-xl border border-white/10" />
              </div>
            ))}
            {images.length === 0 ? <div className="text-sm text-white/60">Nessuna immagine disponibile.</div> : null}
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
