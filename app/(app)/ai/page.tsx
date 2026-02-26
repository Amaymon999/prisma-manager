import Link from "next/link";
import { prisma } from "@/lib/db";
import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AiLibraryPage() {
  const projects = await prisma.aiProject.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <MotionPage>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">AI Creative Studio</h1>
            <p className="text-sm text-white/60">Libreria progetti creativi: immagini + copy + export.</p>
          </div>
          <Link href="/ai/new"><Button>Nuova creatività</Button></Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/ai/${p.id}`}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-soft">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.platform} • {p.objective}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-white/70">
                  <div className="line-clamp-2">{p.description}</div>
                  <div className="mt-3 text-xs text-white/50">{new Date(p.createdAt).toLocaleDateString("it-IT")}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MotionPage>
  );
}
