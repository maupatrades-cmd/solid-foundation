import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TaskRow } from "@/lib/owner-dashboard.functions";

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  urgent: "destructive",
  high: "default",
  normal: "secondary",
  low: "outline",
};

export function TaskWidget({ tasks }: { tasks: TaskRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your open tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open tasks. Nice.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 text-sm">
                <div className="flex-1">
                  <p className="font-medium leading-tight">{t.title}</p>
                  {t.due_at && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due {new Date(t.due_at).toLocaleDateString("en-ZA")}
                    </p>
                  )}
                </div>
                <Badge variant={PRIORITY_VARIANT[t.priority] ?? "secondary"} className="capitalize">
                  {t.priority}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
