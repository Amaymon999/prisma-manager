import { prisma } from "@/lib/db";
import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function scoreBadge(score: number) {
  if (score >= 70) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  if (score >= 40) return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-rose-400/30 bg-rose-400/10 text-rose-200";
}

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });

  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Leads</h1>
          <p className="text-sm text-white/60">Lista operativa con highlight follow-up.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista lead</CardTitle>
            <CardDescription>MVP: tabella semplice (filtri/sorting/pagination arrivano dopo).</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left font-medium">Nome</th>
                  <th className="py-2 text-left font-medium">Fonte</th>
                  <th className="py-2 text-left font-medium">Stage</th>
                  <th className="py-2 text-left font-medium">Score</th>
                  <th className="py-2 text-left font-medium">Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const overdue = l.followUpAt ? l.followUpAt.getTime() < Date.now() : false;
                  return (
                    <tr key={l.id} className={`border-b border-white/5 ${overdue ? "bg-rose-500/10" : "hover:bg-white/5"} transition`}>
                      <td className="py-3">{l.name}</td>
                      <td className="py-3 text-white/80">{l.source}</td>
                      <td className="py-3"><Badge>{l.stage}</Badge></td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${scoreBadge(l.score)}`}>{l.score}</span>
                      </td>
                      <td className="py-3 text-white/80">
                        {l.followUpAt ? new Date(l.followUpAt).toLocaleDateString("it-IT") : "—"}
                        {overdue ? <span className="ml-2 text-rose-200 text-xs">scaduto</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
