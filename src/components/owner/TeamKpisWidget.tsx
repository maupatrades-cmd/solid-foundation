import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TeamKpiRow } from "@/lib/owner-dashboard.functions";

export function TeamKpisWidget({ rows }: { rows: TeamKpiRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team KPIs (this month)</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.staff_name}>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium leading-tight">{r.staff_name}</p>
                    {r.role && (
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    )}
                  </div>
                  <span
                    className={
                      "text-sm font-semibold " +
                      (r.pct >= 100 ? "text-emerald-600" : r.pct >= 80 ? "text-amber-600" : "text-red-600")
                    }
                  >
                    {r.pct}%
                  </span>
                </div>
                <Progress value={Math.min(r.pct, 150)} className="h-1.5 mt-1.5" />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
