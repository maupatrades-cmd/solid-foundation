import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyPaidPoint } from "@/lib/owner-dashboard.functions";

function formatZAR(n: number) {
  return "R" + Math.round(n).toLocaleString();
}
function shortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });
}

export function WeeklyPaidChart({ data }: { data: WeeklyPaidPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly paid invoices</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A1F44" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#0A1F44" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="weekStart"
              tickFormatter={shortDate}
              fontSize={11}
              tick={{ fill: "currentColor" }}
            />
            <YAxis tickFormatter={(v) => `R${Math.round(v / 1000)}k`} fontSize={11} tick={{ fill: "currentColor" }} />
            <Tooltip
              formatter={(v: number) => formatZAR(v)}
              labelFormatter={(l) => `Week of ${shortDate(String(l))}`}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#0A1F44"
              strokeWidth={2}
              fill="url(#paidGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
