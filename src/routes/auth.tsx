import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { WavingMascot } from "@/components/brand/WavingMascot";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Marketing iO" },
      { name: "description", content: "Sign in to your Marketing iO account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");

  // Typewriter "Welcome back"
  useEffect(() => {
    const full = "Welcome back";
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setWelcomeText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 115);
    return () => clearInterval(id);
  }, []);

  async function routeByRole(userId: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roles = (data ?? []).map((r) => r.role);
    const isPrivileged = roles.includes("owner") || roles.includes("admin");
    navigate({ to: isPrivileged ? "/owner" : "/dashboard", replace: true });
  }

  // Redirect if already signed in
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted && data.user) routeByRole(data.user.id);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Invalid email or password.");
      return;
    }
    toast.success("Welcome back!");
    if (data.user) await routeByRole(data.user.id);
  }

  const inputCls =
    "w-full bg-white border border-input text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden bg-background">
      {/* Subtle brand hints */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #0A1F44, #E63946)" }}
        />
        <div
          className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, #0A1F44 0%, #E63946 70%, transparent 100%)" }}
        />
      </div>

      {/* Logo + tagline */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center mb-10"
      >
        <Logo glow className="h-32 sm:h-40" />
        <p
          className="text-center font-semibold tracking-widest uppercase select-none mt-1"
          style={{ fontSize: 12, letterSpacing: 3, color: "#E63946" }}
        >
          Too Good To Stay Hidden
        </p>
        <div
          className="font-bold select-none mt-2"
          style={{ fontSize: 22, minHeight: 36, color: "#0A1F44" }}
          aria-label="Welcome back"
        >
          {welcomeText}
          <span className="mio-caret" aria-hidden="true">|</span>
          <style>{`@keyframes mio-caret-blink{0%,49%{opacity:1}50%,100%{opacity:0}}.mio-caret{display:inline-block;margin-left:2px;color:#E63946;animation:mio-caret-blink .9s steps(1) infinite}`}</style>
        </div>
      </motion.div>

      {/* Card + mascot wrapper */}
      <div className="relative w-full max-w-sm z-10">
        <WavingMascot />

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="relative w-full rounded-2xl p-6 pt-10 space-y-4 bg-card"
          style={{ border: "1px solid #E3E3E3", boxShadow: "0 4px 24px rgba(10,31,68,0.08)" }}
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputCls}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputCls} pr-10`}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-white text-sm transition disabled:opacity-60 hover:brightness-110"
            style={{ background: "#0A1F44", boxShadow: "0 4px 14px rgba(10,31,68,0.25)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#0A1F44] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.form>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6 relative z-10">
        Need help?{" "}
        <a href="mailto:support@marketingio.co.za" className="hover:text-foreground">
          support@marketingio.co.za
        </a>
      </p>
    </div>
  );
}
