import { prisma } from "@/lib/db";
import { MotionPage } from "@/components/app/motion-page";
import { KpiCard } from "@/components/app/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LeadStage } from "@prisma/client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default async function DashboardPage() {
  const [lead7, lead30, activeProjects, overdueTasks, bySource] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
    prisma.lead.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 864e5) } } }),
    prisma.project.count({ where: { status: { in: ["KICKOFF", "ACTIVE"] } } }),
    prisma.task.count({ where: { dueAt: { lt: new Date() }, status: { not: "DONE" } } }),
    prisma.lead.groupBy({ by: ["source"], _count: { source: true } })
  ]);

  const won = await prisma.lead.count({ where: { stage: LeadStage.WON } });
  const totalClosed = await prisma.lead.count({ where: { stage: { in: [LeadStage.WON, LeadStage.LOST] } } });
  const conv = totalClosed === 0 ? 0 : Math.round((won / totalClosed) * 100);

  const data = bySource.map((x) => ({ name: x.source, value: x._count.source }));

  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-white/60">Panoramica operativa e KPI principali.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard title="Lead (7gg)" desc="Nuovi lead recenti" value={lead7} />
          <KpiCard title="Lead (30gg)" desc="Volume mese" value={lead30} />
          <KpiCard title="Conversion" desc="Vinti su chiusi" value={conv} />
          <KpiCard title="Task in ritardo" desc="Da risolvere oggi" value={overdueTasks} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead per fonte</CardTitle>
            <CardDescription>Distribuzione canali acquisizione</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "#0B0F1A", border: "1px solid rgba(255,255,255,0.12)" }} />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
