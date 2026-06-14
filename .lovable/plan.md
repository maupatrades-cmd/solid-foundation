# Slice 1 — Owner Shell + Dashboard

Feature-parity rebuild of sections **0 (Login → Owner landing)** and **1 (OwnerDashboard)** from `docs/architecture/OWNER_FEATURE_WALKTHROUGH.md`. Everything else in the doc is deferred to later slices.

## Reference doc
- Downloaded to `docs/architecture/OWNER_FEATURE_WALKTHROUGH.md` (811 lines, fetched from `claude/owner-walkthrough-doc`).
- Source code referenced via `cross_project--read_project_file` against the same branch as needed (e.g. `src/pages/OwnerDashboard.jsx`, `base44/functions/auth-login/entry.ts`).

## Data import — important clarification
The old CRM runs on **Base44** (its own backend platform). The GitHub repo contains schema definitions under `base44/` but **does not contain DB rows**. To smoke-test against real data I need one of:
1. CSV exports of `Client`, `Deal`, `Invoice`, `Commission`, `Lead`, `MonthlyReport`, `Task`, `AppUser`, `Playbook` from the Base44 admin — uploaded to chat.
2. A SQL dump if you have direct DB access.
3. **For this slice, seed realistic demo data** (~12 clients, ~25 deals across stages, ~40 invoices spanning 12 weeks, ~15 leads, ~8 commissions, ~6 tasks) so the dashboard renders. Swap to real data when the export arrives.

I will proceed with **option 3 (seeded demo data)** unless you upload CSVs in your next message.

## Scope of slice 1
1. **Schema** — tables needed to render the dashboard:
   `clients`, `deals`, `invoices`, `leads`, `commissions`, `tasks`, `playbooks`, `monthly_reports`.
   Mirror Base44 field names (snake_case) from the walkthrough doc + cross-project source reads.
2. **Auth** — Email/password sign-in already exists. The original adds Resend OTP MFA + lockout. For slice 1: keep current email/password, **add OTP MFA via Resend** in a follow-up so we don't block the dashboard build. (Confirm: skip OTP for now, or block on it?)
3. **Role gating** — Add `owner` to `app_role` enum. Sign-in routes `owner` to `/owner`, others to `/`.
4. **Owner shell** — `/owner` layout under `_authenticated/`: sidebar with the 12 surfaces listed in section 12 of the doc (only the Dashboard link is live; others are stubs flagged "coming in slice 2").
5. **Owner dashboard** — `/owner` index page renders the section 1 spec:
   - 6 KPI cards: Active clients, Pipeline value (R), MRR (R), Closed deals this month, Open leads, Commission accrued this month.
   - 12-week paid-invoices area chart (SAST weeks, Recharts).
   - Pipeline stage funnel bar chart.
   - 3 widgets: TaskWidget (your open tasks), TeamKPIsWidget (staff vs targets), QuickScriptsWidget (owner-pinned playbooks).
6. **Aggregation** — done **server-side** in `createServerFn` (fixes the doc's "Known issues: slow client-side aggregation"). One RPC returns all KPIs + chart series + widget data.
7. **Seed migration** — SQL `INSERT` block creating the demo rows.

## Out of scope (later slices, per section 16)
Sales spine (leads/deals/log-sale), money spine (invoice runs, payroll, commissions state machine), contracts, fulfilment, team/HR admin, marketing/catalog, audit drill-down, comms, settings.

## Technical details

### File layout
```text
src/routes/
  _authenticated/
    owner.tsx                 # owner shell layout (sidebar + Outlet)
    owner.index.tsx           # dashboard page
src/components/owner/
  KpiCard.tsx
  WeeklyPaidChart.tsx
  PipelineFunnel.tsx
  TaskWidget.tsx
  TeamKpisWidget.tsx
  QuickScriptsWidget.tsx
  OwnerSidebar.tsx
src/lib/
  owner-dashboard.functions.ts   # createServerFn: getOwnerDashboard()
```

### Server function shape
`getOwnerDashboard()` — `requireSupabaseAuth` + `has_role(uid,'owner')` guard. Runs SQL aggregates (sum/group/date_trunc to week in `Africa/Johannesburg`) and returns one DTO `{ kpis, weeklyPaid[12], funnel[], tasks[], teamKpis[], playbooks[] }`. Client uses `useSuspenseQuery` via the TanStack Query default pattern.

### Migration order
1. Create `app_role` value `'owner'` (if not present) + 8 tables with grants + RLS scoped to owner/admin via `has_role`.
2. Seed function/insert demo rows.
3. Grant current logged-in user the `owner` role (you'll need to run this manually or tell me your user email and I'll include it in the seed).

### Charts
Recharts (matches original). Already a common dep; will install if missing.

## Smoke test steps (after approve + build)
1. Sign in with your existing account.
2. (One-time) I'll provide a one-click "Make me owner" button on `/` for the first user — clicks calls a server fn that grants `owner` role to `auth.uid()` only if no owner exists yet (bootstrap pattern).
3. Navigate to `/owner` — sidebar visible, dashboard loads in <2s.
4. Verify 6 KPI cards show non-zero numbers from seed data.
5. Verify weekly chart shows 12 bars, pipeline funnel shows all stages.
6. Verify TaskWidget lists tasks assigned to you (seed includes 2 for the bootstrap owner).
7. Click a sidebar stub → see "Coming in slice 2" placeholder.
8. Sign out → redirected to `/auth`; `/owner` redirects to `/auth` when unauthenticated.

## Open questions before I build
1. **OTP MFA** — block slice 1 on it, or defer to slice 1b?
2. **Bootstrap owner** — your account email so I can auto-grant `owner` in the seed migration? (Otherwise I add the one-click bootstrap button.)
3. **Data** — proceed with seeded demo, or are you uploading CSVs?
