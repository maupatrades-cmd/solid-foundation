import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type OwnerKpis = {
  activeClients: number;
  pipelineValue: number;
  mrr: number;
  closedDealsThisMonth: number;
  openLeads: number;
  commissionAccruedThisMonth: number;
};

export type WeeklyPaidPoint = { weekStart: string; total: number };
export type FunnelPoint = { stage: string; count: number };
export type TaskRow = {
  id: string;
  title: string;
  priority: string;
  due_at: string | null;
};
export type TeamKpiRow = {
  staff_name: string;
  role: string | null;
  target: number;
  actual: number;
  pct: number;
};
export type PlaybookRow = { id: string; title: string; body: string | null };

export type OwnerDashboardDto = {
  kpis: OwnerKpis;
  weeklyPaid: WeeklyPaidPoint[];
  funnel: FunnelPoint[];
  tasks: TaskRow[];
  teamKpis: TeamKpiRow[];
  playbooks: PlaybookRow[];
};

const PIPELINE_STAGES = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];

export const getOwnerDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OwnerDashboardDto> => {
    const { supabase, userId } = context;

    // Role guard
    const { data: isOwner } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "owner",
    });
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (!isOwner && !isAdmin) {
      throw new Error("Forbidden: owner role required");
    }

    // Parallel fetches
    const [
      clientsRes,
      dealsRes,
      invoicesRes,
      leadsRes,
      commissionsRes,
      tasksRes,
      playbooksRes,
      reportsRes,
    ] = await Promise.all([
      supabase.from("clients").select("id,status,monthly_retainer"),
      supabase.from("deals").select("id,stage,setup_fee,monthly_retainer,term_months,closed_at"),
      supabase.from("invoices").select("amount,status,paid_at,issued_at"),
      supabase.from("leads").select("id,status"),
      supabase.from("commissions").select("amount,accrued_at"),
      supabase
        .from("tasks")
        .select("id,title,priority,due_at,status,assigned_to")
        .eq("status", "open")
        .order("due_at", { ascending: true })
        .limit(20),
      supabase
        .from("playbooks")
        .select("id,title,body")
        .eq("pinned_for_role", "owner")
        .order("created_at", { ascending: true }),
      supabase
        .from("monthly_reports")
        .select("staff_name,role,kpi_target,kpi_actual,period_month")
        .order("period_month", { ascending: false })
        .limit(50),
    ]);

    const clients = clientsRes.data ?? [];
    const deals = dealsRes.data ?? [];
    const invoices = invoicesRes.data ?? [];
    const leads = leadsRes.data ?? [];
    const commissions = commissionsRes.data ?? [];
    const tasks = tasksRes.data ?? [];
    const playbooks = playbooksRes.data ?? [];
    const reports = reportsRes.data ?? [];

    // KPIs
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeClients = clients.filter((c) => c.status === "active").length;
    const mrr = clients
      .filter((c) => c.status === "active")
      .reduce((s, c) => s + Number(c.monthly_retainer || 0), 0);

    const pipelineValue = deals
      .filter((d) => d.stage !== "closed_lost")
      .reduce(
        (s, d) =>
          s +
          Number(d.setup_fee || 0) +
          Number(d.monthly_retainer || 0) * Number(d.term_months || 0),
        0,
      );

    const closedDealsThisMonth = deals.filter(
      (d) =>
        d.stage === "closed_won" &&
        d.closed_at &&
        new Date(d.closed_at) >= monthStart,
    ).length;

    const openLeads = leads.filter(
      (l) => l.status === "open" || l.status === "contacted" || l.status === "qualified",
    ).length;

    const commissionAccruedThisMonth = commissions
      .filter((c) => c.accrued_at && new Date(c.accrued_at) >= monthStart)
      .reduce((s, c) => s + Number(c.amount || 0), 0);

    const kpis: OwnerKpis = {
      activeClients,
      pipelineValue,
      mrr,
      closedDealsThisMonth,
      openLeads,
      commissionAccruedThisMonth,
    };

    // Weekly paid invoices — last 12 weeks (Monday-anchored)
    const weeks: WeeklyPaidPoint[] = [];
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const day = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    for (let i = 11; i >= 0; i--) {
      const start = new Date(monday);
      start.setDate(monday.getDate() - i * 7);
      weeks.push({ weekStart: start.toISOString().slice(0, 10), total: 0 });
    }
    for (const inv of invoices) {
      if (inv.status !== "paid") continue;
      const when = inv.paid_at ?? inv.issued_at;
      if (!when) continue;
      const d = new Date(when);
      d.setHours(0, 0, 0, 0);
      const dDay = d.getDay();
      const dMon = new Date(d);
      dMon.setDate(d.getDate() - ((dDay + 6) % 7));
      const key = dMon.toISOString().slice(0, 10);
      const bucket = weeks.find((w) => w.weekStart === key);
      if (bucket) bucket.total += Number(inv.amount || 0);
    }

    // Funnel
    const funnel: FunnelPoint[] = PIPELINE_STAGES.map((stage) => ({
      stage,
      count: deals.filter((d) => d.stage === stage).length,
    }));

    // Tasks: prioritise tasks assigned to current user, else any open task
    const myTasks = tasks.filter((t) => t.assigned_to === userId);
    const taskList = (myTasks.length > 0 ? myTasks : tasks).slice(0, 6);

    // Team KPIs — latest month per staff
    const latestPeriod =
      reports.length > 0
        ? reports.reduce((max, r) =>
            r.period_month > max ? r.period_month : max,
            reports[0].period_month,
          )
        : null;
    const teamKpis: TeamKpiRow[] = reports
      .filter((r) => r.period_month === latestPeriod)
      .map((r) => {
        const target = Number(r.kpi_target || 0);
        const actual = Number(r.kpi_actual || 0);
        return {
          staff_name: r.staff_name,
          role: r.role,
          target,
          actual,
          pct: target > 0 ? Math.round((actual / target) * 100) : 0,
        };
      })
      .sort((a, b) => b.pct - a.pct);

    return {
      kpis,
      weeklyPaid: weeks,
      funnel,
      tasks: taskList.map((t) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        due_at: t.due_at,
      })),
      teamKpis,
      playbooks: playbooks.map((p) => ({ id: p.id, title: p.title, body: p.body })),
    };
  });

export const bootstrapOwner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("bootstrap_owner");
    if (error) throw new Error(error.message);
    return data as { ok: boolean; granted?: string; already_owner?: boolean; error?: string };
  });
