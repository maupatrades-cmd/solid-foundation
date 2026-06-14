import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelPoint } from "@/lib/owner-dashboard.functions";

const STAGE_LABEL: Record<string, string> = {
  new: "New",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Won",
  closed_lost: "Lost",
};

export function PipelineFunnel({ data }: { data: FunnelPoint[] }) {
  const display = data.map((d) => ({ ...d, label: STAGE_LABEL[d.stage] ?? d.stage }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline stages</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={display}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" fontSize={11} tick={{ fill: "currentColor" }} />
            <YAxis allowDecimals={false} fontSize={11} tick={{ fill: "currentColor" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#E63946" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
