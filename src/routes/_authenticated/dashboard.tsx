import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => setRoles((data ?? []).map((r) => r.role)));
  }, [user.id]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Signed in as {user.email}</p>
        <p className="text-sm">
          <span className="text-muted-foreground">Role: </span>
          <span className="font-medium">{roles.join(", ") || "no role assigned"}</span>
        </p>
        <Button onClick={handleSignOut} variant="outline">
          Sign out
        </Button>
      </div>
    </div>
  );
}
