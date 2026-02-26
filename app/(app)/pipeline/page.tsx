import { MotionPage } from "@/components/app/motion-page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PipelinePage() {
  return (
    <MotionPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Pipeline</h1>
          <p className="text-sm text-white/60">Kanban drag&drop: step successivo.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Kanban</CardTitle>
            <CardDescription>Placeholder per routing.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-white/70">
            Qui metteremo il Kanban completo con drag&drop e update stage.
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
