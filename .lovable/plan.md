# Port branding, mascot & auth UX from the old Marketing iO project

## Scope (what I'll change)

Only the auth experience and shared brand assets. No changes to `src/lib/`, `supabase/migrations/`, `tests/`, or the existing `_authenticated` pages.

## What the old project has that we'll bring over

- **Logo PNG** — currently hot-linked from base44 CDN (`marketing_io_main_logo`). I'll download it once and upload it via `lovable-assets` so it lives on our own CDN with a stable `.asset.json` pointer.
- **Waving mascot** — `src/assets/lottie/mascot-mj-dance.json` (35 KB Lottie). Uploaded as a CDN asset; rendered with `lottie-react`.
- **SignIn visuals** — logo + "Too Good To Stay Hidden" tagline + typewriter "Welcome back" + framer-motion mascot that flies in over the card with a typed speech bubble + brand colours `#0A1F44` (navy) and `#E63946` (red). Already matches the design tokens we set up last turn.
- **Register multi-step flow** — 5-step form (account → business → story → current state → contact prefs). Old backend stored all of it on a custom `User` entity; we'll keep the same UX but persist the extra fields into our `profiles` table.
- **Auth emails** — old project sent its own templated emails. We'll scaffold Lovable Cloud's auth email templates and brand them with the logo + navy/red palette so confirmation / password-reset / magic-link emails match.

## What we will NOT port (and why)

- **base44 backend code** (`auth-login` edge function, custom OTP/MFA, captcha-on-login, account-lockout). Supabase Auth handles login/lockout natively; layering a custom OTP flow on top is a separate, larger piece of work. The plan keeps the visible captcha on Sign-up only (matches the old Register).
- **`AnimatedBot.jsx` purple SVG** — the SignIn page uses the Lottie mascot, not this SVG, so it's dead code in context.
- **`SignIn`'s 423 / `password_reset_required` branch** — depends on the custom backend. Supabase's normal "forgot password" link covers the same UX.

## Build steps

### 1. Brand assets (CDN)
- `curl` the logo PNG from the base44 URL into `/tmp`, then `lovable-assets create` → `src/assets/marketing-io-logo.png.asset.json`.
- Copy the Lottie JSON, then `lovable-assets create` → `src/assets/mascot-mj-dance.json.asset.json`. Fetch the JSON at runtime via `fetch(asset.url).then(r => r.json())` so we don't bundle 35 KB into the auth chunk.
- `bun add lottie-react framer-motion`.

### 2. Shared components (`src/components/brand/`)
- `Logo.tsx` — `<img>` using the asset pointer, accepts `className` for sizing.
- `Mascot.tsx` — wraps `lottie-react` with two modes (`loop` decoration, `overlay` full-screen dismissible — same API as the old `MascotPlayer`).
- `WavingMascot.tsx` — the framer-motion fly-in + typewriter speech bubble used on SignIn.

### 3. Rewrite `src/routes/auth.tsx` (SignIn tab)
- Replace the "Marketing IO CRM" title with the `<Logo />` + tagline + typewriter "Welcome back".
- Wrap the card with `WavingMascot` over the top.
- Keep the existing Supabase `signInWithPassword` + `routeByRole` logic untouched.
- Move Sign-up to its own route (next step) and replace the Sign-up tab with a link to it.

### 4. New route `src/routes/register.tsx` — 5-step Sign-up
- Step 1 (account): first/last name, email, mobile, city, street, province, password + confirm, captcha, terms.
- Step 2 (business): business name, industry, years, team size, address, province.
- Step 3 (story): 12-month goal, biggest challenge, founder inspiration, competitor envy (all skippable).
- Step 4 (current state): revenue range, new-customer target, urgency, marketing assets checklist, agency history (skippable).
- Step 5 (contact): budget, channels, best call time, consultation/proposal checkboxes, POPIA consent (required).
- On submit of step 1: call `supabase.auth.signUp` with `data: { full_name, ... }`. On success of later steps: `supabase.from("profiles").update(...)` for the signed-in user. If the user closes the tab mid-flow, the account exists from step 1 onward and they can resume later.
- Constant lists (PROVINCES, INDUSTRIES, etc.) live in `src/components/auth/register-options.ts`.

### 5. Profiles schema extension (one migration)
- `ALTER TABLE public.profiles` to add nullable columns for the extra fields collected in steps 1–5 (mobile, city, province, address, business name, industry, years, team size, 12-month goal, challenge, inspiration, competitor envy, revenue range, customer target, urgency, marketing assets `text[]`, agency history, budget, contact channels `text[]`, best call time, wants_consultation, wants_proposal, popia_consent, terms_agreed).
- RLS already allows the user to update their own profile row — no policy changes needed.

### 6. Branded auth emails
- Call `scaffold_auth_email_templates` to generate the React Email templates + edge function.
- Restyle each template (signup, recovery, magic-link, invite, email-change, reauthentication) with the logo, navy/red palette, and "Too Good To Stay Hidden" tagline.
- Deploy the `auth-email-hook` edge function.

### 7. Cleanup
- Remove the hard-coded "Marketing IO CRM" string from `src/routes/auth.tsx` head/title (replace with "Sign in — Marketing iO").
- Verify build is green and the preview shows: logo, typewriter, mascot fly-in, working sign-in, working multi-step register.

## Open question

The old register collects 25+ profile fields. **Do you want all 5 steps now, or should I ship steps 1 + 5 (account + contact prefs) first and leave the business/story/state steps for a follow-up?** Full version takes longer but matches the old project exactly.
