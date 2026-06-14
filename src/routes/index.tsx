import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketing IO CRM" },
      { name: "description", content: "Marketing IO CRM — manage clients, roles, and operations." },
      { property: "og:title", content: "Marketing IO CRM" },
      { property: "og:description", content: "Manage clients, roles, and operations." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRoles(userId: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    setRoles((data ?? []).map((r) => r.role));
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadRoles(data.user.id);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadRoles(u.id);
      else setRoles([]);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Marketing IO CRM</h1>
        <p className="text-muted-foreground">
          {loading
            ? "Loading…"
            : user
              ? `Signed in as ${user.email}`
              : "Sign in to continue."}
        </p>
        {!loading && (
          <div className="flex justify-center gap-2">
            {user ? (
              <Button onClick={handleSignOut} variant="outline">
                Sign out
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
