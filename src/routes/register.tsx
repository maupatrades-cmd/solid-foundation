import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import {
  AGENCY_HISTORY_OPTS,
  BUDGET_RANGES,
  CALL_TIMES,
  CHALLENGES,
  CONTACT_CHANNELS,
  EMPLOYEE_RANGES,
  INDUSTRIES,
  MARKETING_ASSETS,
  NEW_CUSTOMER_TARGETS,
  PROVINCES,
  REVENUE_RANGES,
  SIGNUP_ATTRIBUTION_OPTIONS,
  TWELVE_MONTH_GOALS,
  URGENCY_LEVELS,
  YEARS_IN_BUSINESS,
} from "@/components/auth/register-options";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — Marketing iO" },
      { name: "description", content: "Sign up for Marketing iO." },
    ],
  }),
  component: RegisterPage,
});

type Opt = [string, string];

function makeCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b}`, answer: a + b };
}

const inputClass =
  "w-full bg-white border border-input text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground";
const labelClass = "block text-sm font-medium text-foreground mb-1";

function TextField({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && "*"}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Opt[];
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && "*"}
      </label>
      <select required={required} value={value} onChange={onChange} className={inputClass}>
        <option value="">— Select —</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxList({
  label,
  values,
  options,
  onToggle,
}: {
  label: string;
  values: string[];
  options: Opt[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(([v, l]) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={values.includes(v)}
              onChange={() => onToggle(v)}
              className="accent-[#0A1F44]"
            />
            <span>{l}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 5) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Step {step} of 5</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #0A1F44, #E63946)" }}
        />
      </div>
    </div>
  );
}

type Form = {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  signed_up_by: string;
  city: string;
  street_address: string;
  province: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;

  business_name: string;
  industry: string;
  years_in_business: string;
  number_of_employees: string;
  business_city: string;
  business_address: string;
  business_province: string;

  twelve_month_goal: string;
  biggest_challenge: string;
  founder_inspiration: string;
  competitor_envy: string;

  monthly_revenue_range: string;
  new_customers_target: string;
  urgency_level: string;
  current_marketing_assets: string[];
  agency_history: string;

  monthly_marketing_budget: string;
  preferred_contact_channels: string[];
  best_call_time: string;
  wants_consultation_call: boolean;
  wants_personalized_proposal: boolean;
  popia_consent: boolean;
};

const initial: Form = {
  first_name: "",
  last_name: "",
  email: "",
  mobile_number: "",
  signed_up_by: "",
  city: "",
  street_address: "",
  province: "",
  password: "",
  confirmPassword: "",
  agreed: false,
  business_name: "",
  industry: "",
  years_in_business: "",
  number_of_employees: "",
  business_city: "",
  business_address: "",
  business_province: "",
  twelve_month_goal: "",
  biggest_challenge: "",
  founder_inspiration: "",
  competitor_envy: "",
  monthly_revenue_range: "",
  new_customers_target: "",
  urgency_level: "",
  current_marketing_assets: [],
  agency_history: "",
  monthly_marketing_budget: "",
  preferred_contact_channels: [],
  best_call_time: "",
  wants_consultation_call: false,
  wants_personalized_proposal: false,
  popia_consent: false,
};

function pwStrength(pw: string): { level: string; color: string } {
  if (pw.length < 10) return { level: "Too short", color: "text-red-600" };
  let score = 0;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { level: "Weak", color: "text-amber-600" };
  if (score === 3) return { level: "Good", color: "text-emerald-600" };
  return { level: "Strong", color: "text-emerald-700" };
}

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<Form>(initial);
  const [showPw, setShowPw] = useState(false);
  const [captcha] = useState(makeCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const strength = useMemo(() => pwStrength(form.password), [form.password]);

  function set<K extends keyof Form>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target as HTMLInputElement;
      const val: Form[K] =
        target.type === "checkbox"
          ? (target.checked as unknown as Form[K])
          : (target.value as unknown as Form[K]);
      setForm((f) => ({ ...f, [key]: val }));
    };
  }

  function toggleArray(key: "current_marketing_assets" | "preferred_contact_channels", v: string) {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] };
    });
  }

  async function persistProfile(patch: Partial<Form> & { onboarding_step?: number }) {
    if (!userId) return;
    const { error: err } = await supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", userId);
    if (err) throw err;
  }

  async function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (parseInt(captchaInput) !== captcha.answer) return setError("Incorrect security answer.");
    if (form.password !== form.confirmPassword) return setError("Passwords don't match.");
    if (strength.level === "Too short") return setError("Password must be at least 10 characters.");
    if (!form.agreed) return setError("You must agree to the Terms of Service.");

    setLoading(true);
    const fullName = `${form.first_name} ${form.last_name}`.trim();
    const { data, error: err } = await supabase.auth.signUp({
      email: form.email.toLowerCase().trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
    const uid = data.user?.id ?? null;
    setUserId(uid);

    // If email confirmation is on, there may be no session yet — we can still
    // patch the profile because handle_new_user created the row and our RLS
    // allows the user (via the just-issued session) to update it. If no session,
    // skip the patch; user can finish later from settings.
    if (uid && data.session) {
      try {
        await persistProfile({
          first_name: form.first_name,
          last_name: form.last_name,
          mobile_number: form.mobile_number,
          city: form.city,
          street_address: form.street_address,
          province: form.province,
          signed_up_by: form.signed_up_by || null as unknown as string,
          terms_agreed: true,
          onboarding_step: 2,
        });
      } catch {
        /* non-fatal */
      }
    }
    setLoading(false);
    if (!data.session) {
      toast.success("Check your email to confirm your account, then come back to finish setup.");
      navigate({ to: "/auth", replace: true });
      return;
    }
    toast.success("Account created!");
    setStep(2);
  }

  async function submitStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await persistProfile({
        business_name: form.business_name,
        industry: form.industry,
        years_in_business: form.years_in_business,
        number_of_employees: form.number_of_employees,
        business_city: form.business_city,
        business_address: form.business_address,
        business_province: form.business_province,
        onboarding_step: 3,
      });
      setStep(3);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function advanceStep3(skip: boolean) {
    setLoading(true);
    try {
      await persistProfile(
        skip
          ? { onboarding_step: 4 }
          : {
              twelve_month_goal: form.twelve_month_goal,
              biggest_challenge: form.biggest_challenge,
              founder_inspiration: form.founder_inspiration,
              competitor_envy: form.competitor_envy,
              onboarding_step: 4,
            },
      );
      setStep(4);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function advanceStep4(skip: boolean) {
    setLoading(true);
    try {
      await persistProfile(
        skip
          ? { onboarding_step: 5 }
          : {
              monthly_revenue_range: form.monthly_revenue_range,
              new_customers_target: form.new_customers_target,
              urgency_level: form.urgency_level,
              current_marketing_assets: form.current_marketing_assets,
              agency_history: form.agency_history,
              onboarding_step: 5,
            },
      );
      setStep(5);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function submitStep5(skip: boolean) {
    if (!skip && !form.popia_consent) return setError("POPIA consent is required.");
    setLoading(true);
    try {
      await persistProfile(
        skip
          ? { onboarding_step: 6 }
          : {
              monthly_marketing_budget: form.monthly_marketing_budget,
              preferred_contact_channels: form.preferred_contact_channels,
              best_call_time: form.best_call_time,
              wants_consultation_call: form.wants_consultation_call,
              wants_personalized_proposal: form.wants_personalized_proposal,
              popia_consent: true,
              onboarding_step: 6,
            },
      );
      toast.success("All done! Welcome to Marketing iO.");
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const SkipBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
    >
      Skip — we'll learn more on a quick call
    </button>
  );

  const BackBtn = ({ to }: { to: number }) => (
    <button
      type="button"
      onClick={() => setStep(to)}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  const continueBtnStyle = { background: "linear-gradient(135deg, #0A1F44 0%, #E63946 100%)" };
  const continueCls =
    "py-3 px-6 rounded-lg font-semibold text-white text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 hover:brightness-110";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-10">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <Logo className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Tell us about your business — even small answers help us help you.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProgressBar step={step} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={submitStep1} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your account</h2>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="First name" required value={form.first_name} onChange={set("first_name")} placeholder="Jane" autoComplete="given-name" />
                <TextField label="Last name" required value={form.last_name} onChange={set("last_name")} placeholder="Smith" autoComplete="family-name" />
              </div>
              <TextField label="Email address" type="email" required value={form.email} onChange={set("email")} placeholder="you@business.co.za" autoComplete="email" />
              <TextField label="Mobile number (SA)" type="tel" required value={form.mobile_number} onChange={set("mobile_number")} placeholder="082 123 4567" autoComplete="tel" />
              <SelectField label="Who signed you up? (optional)" value={form.signed_up_by} onChange={set("signed_up_by")} options={SIGNUP_ATTRIBUTION_OPTIONS} />
              <TextField label="City" required value={form.city} onChange={set("city")} placeholder="Johannesburg" autoComplete="address-level2" />
              <TextField label="Street address" required value={form.street_address} onChange={set("street_address")} placeholder="75 Marshall Street" autoComplete="street-address" />
              <SelectField label="Province" required value={form.province} onChange={set("province")} options={PROVINCES} />

              <div>
                <label className={labelClass}>Password *</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    required
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
                    placeholder="Min 10 chars, upper, lower, number"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <p className={`text-xs mt-1 ${strength.color}`}>Strength: {strength.level}</p>
                )}
              </div>

              <TextField label="Confirm password" type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" autoComplete="new-password" />

              <div>
                <label className={labelClass}>Security check: {captcha.question} = ?</label>
                <input
                  type="number"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className={inputClass}
                  placeholder="Answer"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={form.agreed} onChange={set("agreed")} className="mt-0.5 accent-[#0A1F44]" />
                <span className="text-xs text-muted-foreground">
                  I agree to Marketing iO's{" "}
                  <a href="/terms" className="text-[#0A1F44] hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                  </a>
                </span>
              </label>

              <button type="submit" disabled={loading} className={`w-full ${continueCls}`} style={continueBtnStyle}>
                {loading ? "Creating account…" : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth" className="text-[#0A1F44] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={submitStep2} className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your business</h2>
              <p className="text-xs text-muted-foreground -mt-2">Helps us tailor the pitch.</p>
              <TextField label="Business name" required value={form.business_name} onChange={set("business_name")} placeholder="Acme Trading (Pty) Ltd" />
              <SelectField label="Industry" required value={form.industry} onChange={set("industry")} options={INDUSTRIES} />
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Years in business" required value={form.years_in_business} onChange={set("years_in_business")} options={YEARS_IN_BUSINESS} />
                <SelectField label="Team size" required value={form.number_of_employees} onChange={set("number_of_employees")} options={EMPLOYEE_RANGES} />
              </div>
              <TextField label="City" required value={form.business_city} onChange={set("business_city")} placeholder="Polokwane" />
              <TextField label="Full address" value={form.business_address} onChange={set("business_address")} placeholder="75 Marshall Street" />
              <SelectField label="Province" required value={form.business_province} onChange={set("business_province")} options={PROVINCES} />

              <div className="flex items-center justify-between gap-4 pt-2">
                <BackBtn to={1} />
                <button type="submit" disabled={loading} className={`flex-1 ${continueCls}`} style={continueBtnStyle}>
                  {loading ? "Saving…" : <>Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your story</h2>
              <p className="text-xs text-muted-foreground -mt-2">Help us understand your vision — skip if you'd rather we call you.</p>
              <SelectField label="Where do you want your business in 12 months?" value={form.twelve_month_goal} onChange={set("twelve_month_goal")} options={TWELVE_MONTH_GOALS} />
              <SelectField label="What's your BIGGEST challenge right now?" value={form.biggest_challenge} onChange={set("biggest_challenge")} options={CHALLENGES} />
              <TextArea label="What inspired you to start this business?" value={form.founder_inspiration} onChange={set("founder_inspiration")} placeholder="Optional — your why." />
              <TextArea label="What's your competitor doing that you wish you were?" value={form.competitor_envy} onChange={set("competitor_envy")} placeholder="Optional — be honest." />
              <div className="flex items-center justify-between gap-4 pt-2">
                <BackBtn to={2} />
                <SkipBtn onClick={() => advanceStep3(true)} />
                <button type="button" onClick={() => advanceStep3(false)} disabled={loading} className={continueCls} style={continueBtnStyle}>
                  {loading ? "Saving…" : <>Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Where you are now</h2>
              <p className="text-xs text-muted-foreground -mt-2">Help us tailor our pitch — skip and we'll ask on a call.</p>
              <SelectField label="Current monthly revenue range" value={form.monthly_revenue_range} onChange={set("monthly_revenue_range")} options={REVENUE_RANGES} />
              <SelectField label="How many NEW customers per month would change your life?" value={form.new_customers_target} onChange={set("new_customers_target")} options={NEW_CUSTOMER_TARGETS} />
              <SelectField label="How urgently do you need results?" value={form.urgency_level} onChange={set("urgency_level")} options={URGENCY_LEVELS} />
              <CheckboxList label="Do you currently have:" values={form.current_marketing_assets} options={MARKETING_ASSETS} onToggle={(v) => toggleArray("current_marketing_assets", v)} />
              <SelectField label="Have you worked with an agency before?" value={form.agency_history} onChange={set("agency_history")} options={AGENCY_HISTORY_OPTS} />
              <div className="flex items-center justify-between gap-4 pt-2">
                <BackBtn to={3} />
                <SkipBtn onClick={() => advanceStep4(true)} />
                <button type="button" onClick={() => advanceStep4(false)} disabled={loading} className={continueCls} style={continueBtnStyle}>
                  {loading ? "Saving…" : <>Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">How to reach you</h2>
              <p className="text-xs text-muted-foreground -mt-2">Last step — how should we follow up?</p>
              <SelectField label="If you were to invest in marketing, what monthly budget feels right?" value={form.monthly_marketing_budget} onChange={set("monthly_marketing_budget")} options={BUDGET_RANGES} />
              <CheckboxList label="How can we reach you?" values={form.preferred_contact_channels} options={CONTACT_CHANNELS} onToggle={(v) => toggleArray("preferred_contact_channels", v)} />
              <SelectField label="Best time to call?" value={form.best_call_time} onChange={set("best_call_time")} options={CALL_TIMES} />

              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.wants_consultation_call} onChange={set("wants_consultation_call")} className="mt-0.5 accent-[#0A1F44]" />
                  <span className="text-sm text-foreground">I want a free 15-min consultation call</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.wants_personalized_proposal} onChange={set("wants_personalized_proposal")} className="mt-0.5 accent-[#0A1F44]" />
                  <span className="text-sm text-foreground">Send me a personalized proposal</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer pt-2 border-t border-border">
                  <input type="checkbox" checked={form.popia_consent} onChange={set("popia_consent")} className="mt-1 accent-[#0A1F44]" />
                  <span className="text-xs text-muted-foreground">
                    <strong>Required:</strong> I agree to receive communication from Marketing iO. POPIA-compliant. Opt out anytime.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <BackBtn to={4} />
                <SkipBtn onClick={() => submitStep5(true)} />
                <button type="button" onClick={() => submitStep5(false)} disabled={loading} className={continueCls} style={continueBtnStyle}>
                  {loading ? "Submitting..." : <>Submit <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Need help?{" "}
          <a href="mailto:support@marketingio.co.za" className="hover:text-foreground">
            support@marketingio.co.za
          </a>
        </p>
      </div>
    </div>
  );
}
