import { createFileRoute, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Users,
  TrendingUp,
  Repeat,
  CheckCircle2,
  Inbox,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  getOwnerDashboard,
  bootstrapOwner,
  type OwnerDashboardDto,
} from "@/lib/owner-dashboard.functions";
import { KpiCard } from "@/components/owner/KpiCard";
import { WeeklyPaidChart } from "@/components/owner/WeeklyPaidChart";
import { PipelineFunnel } from "@/components/owner/PipelineFunnel";
import { TaskWidget } from "@/components/owner/TaskWidget";
import { TeamKpisWidget } from "@/components/owner/TeamKpisWidget";
import { QuickScriptsWidget } from "@/components/owner/QuickScriptsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const dashboardQuery = (fn: () => Promise<OwnerDashboardDto>) =>
  queryOptions({
    queryKey: ["owner-dashboard"],
    queryFn: fn,
  });

export const Route = createFileRoute("/_authenticated/owner/")({
  head: () => ({ meta: [{ title: "Owner Dashboard — Marketing iO" }] }),
  component: OwnerDashboardPage,
  errorComponent: OwnerDashboardError,
});

function formatZAR(n: number) {
  return "R" + Math.round(n).toLocaleString("en-ZA");
}

function OwnerDashboardPage() {
  const fetchDashboard = useServerFn(getOwnerDashboard);
  const { data } = useSuspenseQuery(dashboardQuery(() => fetchDashboard()));
  const { kpis } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Owner dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time pulse of clients, pipeline, money, and team.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Active clients" value={String(kpis.activeClients)} icon={Users} />
        <KpiCard label="Pipeline value" value={formatZAR(kpis.pipelineValue)} icon={TrendingUp} hint="Open deals × term" />
        <KpiCard label="MRR" value={formatZAR(kpis.mrr)} icon={Repeat} hint="Active retainers" />
        <KpiCard label="Closed this month" value={String(kpis.closedDealsThisMonth)} icon={CheckCircle2} />
        <KpiCard label="Open leads" value={String(kpis.openLeads)} icon={Inbox} />
        <KpiCard label="Commission accrued" value={formatZAR(kpis.commissionAccruedThisMonth)} icon={Wallet} hint="This month" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyPaidChart data={data.weeklyPaid} />
        <PipelineFunnel data={data.funnel} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TaskWidget tasks={data.tasks} />
        <TeamKpisWidget rows={data.teamKpis} />
        <QuickScriptsWidget playbooks={data.playbooks} />
      </div>
    </div>
  );
}

function OwnerDashboardError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const runBootstrap = useServerFn(bootstrapOwner);
  const message = error.message || "";
  const isForbidden = /Forbidden|owner role/i.test(message);

  async function handleBootstrap() {
    try {
      const res = await runBootstrap();
      if (res.ok) {
        toast.success("You are now the workspace owner.");
        router.invalidate();
        reset();
      } else {
        toast.error(res.error || "Could not grant owner role.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bootstrap failed");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>{isForbidden ? "You're not the owner yet" : "Dashboard didn't load"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {isForbidden ? (
            <>
              <p className="text-muted-foreground">
                The owner dashboard requires the <span className="font-medium">owner</span> role.
                If no owner exists yet, you can claim the role for this workspace.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleBootstrap}>Make me the owner</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.invalidate();
                    reset();
                  }}
                >
                  Retry
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">{message || "Unknown error"}</p>
              <Button
                onClick={() => {
                  router.invalidate();
                  reset();
                }}
              >
                Retry
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
