import { prisma } from "@/lib/db";
import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Task</h1>
          <p className="text-sm text-white/60">MVP: lista semplice.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista task</CardTitle>
            <CardDescription>Le viste kanban/agenda arrivano dopo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-white/60">{t.dueAt ? new Date(t.dueAt).toLocaleDateString("it-IT") : "—"}</div>
                </div>
                <Badge>{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
