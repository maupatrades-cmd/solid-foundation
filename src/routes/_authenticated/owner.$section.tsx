import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/owner/$section")({
  head: () => ({ meta: [{ title: "Coming soon — Marketing iO" }] }),
  component: OwnerStubPage,
});

function OwnerStubPage() {
  const { section } = Route.useParams();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const label = section.charAt(0).toUpperCase() + section.slice(1);

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>{label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            <code>{pathname}</code> is coming in slice 2 of the owner rebuild.
          </p>
          <p className="text-muted-foreground">
            Slice 1 ships the owner shell + dashboard. Sales, money, contracts,
            fulfilment, team/HR, marketing, activity, comms, and settings come next.
          </p>
          <Button asChild variant="outline">
            <Link to="/owner">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
