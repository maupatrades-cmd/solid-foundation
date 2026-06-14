
-- ============================================================
-- Slice 1 schema: clients, deals, invoices, leads, commissions, tasks, playbooks, monthly_reports
-- ============================================================

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  status text NOT NULL DEFAULT 'active', -- active | paused | churned | prospect
  monthly_retainer numeric(12,2) NOT NULL DEFAULT 0,
  industry text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY clients_rw_priv ON public.clients FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  stage text NOT NULL DEFAULT 'new', -- new | qualified | proposal | negotiation | closed_won | closed_lost
  setup_fee numeric(12,2) NOT NULL DEFAULT 0,
  monthly_retainer numeric(12,2) NOT NULL DEFAULT 0,
  term_months int NOT NULL DEFAULT 12,
  owner_user_id uuid,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deals TO authenticated;
GRANT ALL ON public.deals TO service_role;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY deals_rw_priv ON public.deals FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  invoice_number text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft', -- draft | sent | paid | overdue | void
  issued_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY invoices_rw_priv ON public.invoices FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  source text,
  status text NOT NULL DEFAULT 'open', -- open | contacted | qualified | converted | lost
  estimated_value numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_rw_priv ON public.leads FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  deal_id uuid REFERENCES public.deals(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'accrued', -- accrued | approved | paid
  accrued_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY commissions_rw_priv ON public.commissions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid,
  status text NOT NULL DEFAULT 'open', -- open | in_progress | done
  priority text NOT NULL DEFAULT 'normal', -- low | normal | high | urgent
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_rw_priv ON public.tasks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin') OR assigned_to = auth.uid())
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin') OR assigned_to = auth.uid());

CREATE TABLE public.playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  pinned_for_role app_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.playbooks TO authenticated;
GRANT ALL ON public.playbooks TO service_role;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY playbooks_rw_priv ON public.playbooks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

CREATE TABLE public.monthly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  staff_name text NOT NULL,
  role text,
  period_month date NOT NULL,
  kpi_target numeric(12,2) NOT NULL DEFAULT 0,
  kpi_actual numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monthly_reports TO authenticated;
GRANT ALL ON public.monthly_reports TO service_role;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY mr_rw_priv ON public.monthly_reports FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'owner') OR has_role(auth.uid(), 'admin'));

-- Updated-at triggers
CREATE TRIGGER t_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_deals_updated BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_commissions_updated BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_playbooks_updated BEFORE UPDATE ON public.playbooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_mr_updated BEFORE UPDATE ON public.monthly_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- Bootstrap-owner helper: first caller (when no owner exists) becomes owner.
-- ============================================================
CREATE OR REPLACE FUNCTION public.bootstrap_owner()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_existing int;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  SELECT count(*) INTO v_existing FROM public.user_roles WHERE role = 'owner';
  IF v_existing > 0 THEN
    -- If caller is already an owner, fine; otherwise refuse
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role = 'owner') THEN
      RETURN jsonb_build_object('ok', true, 'already_owner', true);
    END IF;
    RETURN jsonb_build_object('ok', false, 'error', 'owner_already_exists');
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'owner')
    ON CONFLICT DO NOTHING;

  -- Assign two demo tasks to the new owner
  UPDATE public.tasks SET assigned_to = v_uid
    WHERE assigned_to IS NULL AND title IN ('Review weekly invoice run', 'Approve commission payouts');

  RETURN jsonb_build_object('ok', true, 'granted', 'owner');
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_owner() TO authenticated;

-- ============================================================
-- SEED demo data
-- ============================================================

INSERT INTO public.clients (id, name, email, status, monthly_retainer, industry, city) VALUES
 ('11111111-0000-0000-0000-000000000001', 'Acme Holdings',         'ops@acme.co.za',        'active',  18500, 'Retail',        'Polokwane'),
 ('11111111-0000-0000-0000-000000000002', 'Baobab Logistics',      'finance@baobab.co.za',  'active',  22000, 'Logistics',     'Polokwane'),
 ('11111111-0000-0000-0000-000000000003', 'Cloud9 Tours',          'hello@cloud9.co.za',    'active',  12000, 'Travel',        'Tzaneen'),
 ('11111111-0000-0000-0000-000000000004', 'Delta Mining',          'pa@deltamining.co.za',  'active',  35000, 'Mining',        'Mokopane'),
 ('11111111-0000-0000-0000-000000000005', 'Echo Health Group',     'info@echohealth.co.za', 'active',  16800, 'Healthcare',    'Polokwane'),
 ('11111111-0000-0000-0000-000000000006', 'FreshFarm Co-op',       'admin@freshfarm.co.za', 'paused',   8000, 'Agriculture',   'Louis Trichardt'),
 ('11111111-0000-0000-0000-000000000007', 'Greenline Auto',        'sales@greenline.co.za', 'active',  14500, 'Automotive',    'Polokwane'),
 ('11111111-0000-0000-0000-000000000008', 'Highveld Schools',      'office@highveld.co.za', 'active',   9500, 'Education',     'Modimolle'),
 ('11111111-0000-0000-0000-000000000009', 'Iron & Co Foundry',     'mark@ironco.co.za',     'churned',     0, 'Manufacturing', 'Mokopane'),
 ('11111111-0000-0000-0000-00000000000a', 'Juno Properties',       'leasing@juno.co.za',    'active',  21000, 'Real Estate',   'Polokwane'),
 ('11111111-0000-0000-0000-00000000000b', 'Kalahari Foods',        'team@kalahari.co.za',   'prospect',    0, 'FMCG',          'Lephalale'),
 ('11111111-0000-0000-0000-00000000000c', 'Limpopo Bank',          'corp@limpopobank.co.za','active',  42000, 'Finance',       'Polokwane');

-- Deals across all stages
INSERT INTO public.deals (id, title, client_id, stage, setup_fee, monthly_retainer, term_months, closed_at) VALUES
 (gen_random_uuid(), 'Acme — SEO + Paid Search retainer', '11111111-0000-0000-0000-000000000001', 'closed_won', 12000, 18500, 12, now() - interval '8 days'),
 (gen_random_uuid(), 'Baobab — Brand refresh + retainer', '11111111-0000-0000-0000-000000000002', 'closed_won', 25000, 22000, 12, now() - interval '12 days'),
 (gen_random_uuid(), 'Cloud9 — Site rebuild',             '11111111-0000-0000-0000-000000000003', 'negotiation', 18000, 12000, 6, NULL),
 (gen_random_uuid(), 'Delta — Enterprise retainer',       '11111111-0000-0000-0000-000000000004', 'closed_won', 40000, 35000, 24, now() - interval '20 days'),
 (gen_random_uuid(), 'Echo Health — Patient portal',      '11111111-0000-0000-0000-000000000005', 'proposal',  60000, 16800, 12, NULL),
 (gen_random_uuid(), 'Greenline — Lead gen campaign',     '11111111-0000-0000-0000-000000000007', 'qualified', 8000,  14500, 6, NULL),
 (gen_random_uuid(), 'Highveld — School branding pack',   '11111111-0000-0000-0000-000000000008', 'new',       4500,   9500, 12, NULL),
 (gen_random_uuid(), 'Juno — Property listings portal',   '11111111-0000-0000-0000-00000000000a', 'proposal',  35000, 21000, 12, NULL),
 (gen_random_uuid(), 'Kalahari — Brand strategy',         '11111111-0000-0000-0000-00000000000b', 'qualified', 15000,      0, 0, NULL),
 (gen_random_uuid(), 'Limpopo Bank — Customer portal',    '11111111-0000-0000-0000-00000000000c', 'negotiation', 75000, 42000, 24, NULL),
 (gen_random_uuid(), 'Iron & Co — Recovery proposal',     '11111111-0000-0000-0000-000000000009', 'closed_lost', 0,      0, 0, now() - interval '40 days'),
 (gen_random_uuid(), 'Acme — Q4 campaign',                '11111111-0000-0000-0000-000000000001', 'new',        6000,      0, 0, NULL),
 (gen_random_uuid(), 'Cloud9 — Photo package',            '11111111-0000-0000-0000-000000000003', 'qualified',  5500,      0, 0, NULL),
 (gen_random_uuid(), 'Delta — Mining annual report',      '11111111-0000-0000-0000-000000000004', 'proposal',  22000,      0, 0, NULL),
 (gen_random_uuid(), 'Echo Health — Pamphlet design',     '11111111-0000-0000-0000-000000000005', 'new',        3000,      0, 0, NULL),
 (gen_random_uuid(), 'FreshFarm — Reactivation',          '11111111-0000-0000-0000-000000000006', 'qualified',  4000,   8000, 6, NULL),
 (gen_random_uuid(), 'Greenline — Vehicle videos',        '11111111-0000-0000-0000-000000000007', 'proposal',  18000,      0, 0, NULL),
 (gen_random_uuid(), 'Highveld — Open day campaign',      '11111111-0000-0000-0000-000000000008', 'new',        2500,      0, 0, NULL),
 (gen_random_uuid(), 'Juno — Drone photography',          '11111111-0000-0000-0000-00000000000a', 'qualified',  9000,      0, 0, NULL),
 (gen_random_uuid(), 'Limpopo Bank — Internal comms',     '11111111-0000-0000-0000-00000000000c', 'new',        8000,      0, 0, NULL),
 (gen_random_uuid(), 'Baobab — Driver training videos',   '11111111-0000-0000-0000-000000000002', 'closed_won', 18000,      0, 0, now() - interval '3 days'),
 (gen_random_uuid(), 'Acme — Influencer partnership',     '11111111-0000-0000-0000-000000000001', 'negotiation', 22000,     0, 0, NULL),
 (gen_random_uuid(), 'Delta — Safety microsite',          '11111111-0000-0000-0000-000000000004', 'qualified',  16000,     0, 0, NULL),
 (gen_random_uuid(), 'Cloud9 — Brochure print run',       '11111111-0000-0000-0000-000000000003', 'closed_lost',  4000,     0, 0, now() - interval '15 days'),
 (gen_random_uuid(), 'Kalahari — Packaging design',       '11111111-0000-0000-0000-00000000000b', 'proposal',   12500,     0, 0, NULL);

-- Invoices spanning 12 weeks: mix of paid and unpaid
INSERT INTO public.invoices (client_id, invoice_number, amount, status, issued_at, paid_at, due_at)
SELECT
  (ARRAY[
    '11111111-0000-0000-0000-000000000001'::uuid,
    '11111111-0000-0000-0000-000000000002'::uuid,
    '11111111-0000-0000-0000-000000000003'::uuid,
    '11111111-0000-0000-0000-000000000004'::uuid,
    '11111111-0000-0000-0000-000000000005'::uuid,
    '11111111-0000-0000-0000-000000000007'::uuid,
    '11111111-0000-0000-0000-000000000008'::uuid,
    '11111111-0000-0000-0000-00000000000a'::uuid,
    '11111111-0000-0000-0000-00000000000c'::uuid
  ])[(g % 9) + 1],
  'INV-' || lpad(g::text, 5, '0'),
  (8000 + (g % 7) * 3500)::numeric,
  CASE WHEN g % 4 = 0 THEN 'sent' WHEN g % 11 = 0 THEN 'overdue' ELSE 'paid' END,
  (now() - ((g * 2) || ' days')::interval),
  CASE WHEN g % 4 = 0 OR g % 11 = 0 THEN NULL ELSE (now() - ((g * 2 - 1) || ' days')::interval) END,
  (now() - ((g * 2) || ' days')::interval) + interval '14 days'
FROM generate_series(0, 39) AS g;

-- Leads
INSERT INTO public.leads (name, email, source, status, estimated_value, created_at) VALUES
 ('Mokopane Builders',    'info@mbuild.co.za',     'website',  'open',       25000, now() - interval '2 days'),
 ('Phalaborwa Hotel',     'gm@phhotel.co.za',      'referral', 'contacted',  60000, now() - interval '5 days'),
 ('Polokwane Pet Vet',    'reception@ppvet.co.za', 'instagram','open',       12000, now() - interval '1 day'),
 ('Sekhukhune Coal',      'pa@sekcoal.co.za',      'cold',     'qualified', 180000, now() - interval '11 days'),
 ('Tshwane Boutique',     'owner@tshboutique.co.za','facebook','contacted',  18000, now() - interval '6 days'),
 ('University of Venda',  'comms@univen.ac.za',    'tender',   'open',      240000, now() - interval '3 days'),
 ('Vhembe Construction',  'sales@vhcon.co.za',     'referral', 'qualified',  85000, now() - interval '14 days'),
 ('Waterberg Resort',     'bookings@wresort.co.za','website',  'open',       42000, now() - interval '4 days'),
 ('Xanadu Lodge',         'host@xanadu.co.za',     'instagram','contacted',  22000, now() - interval '7 days'),
 ('Yarona Travel',        'team@yarona.co.za',     'cold',     'open',       30000, now() - interval '8 days'),
 ('Zion Christian Bakery','sales@zcbakery.co.za',  'referral', 'converted',  16000, now() - interval '25 days'),
 ('Limpopo FM Radio',     'ads@lfmradio.co.za',    'website',  'open',       28000, now() - interval '2 days'),
 ('Marula Spirits',       'mktg@marula.co.za',     'instagram','qualified', 110000, now() - interval '9 days'),
 ('Nzhelele Farms',       'office@nzhelele.co.za', 'cold',     'lost',       14000, now() - interval '30 days'),
 ('Olifants Game Reserve','reservations@olifants.co.za','referral','open',   95000, now() - interval '1 day');

-- Commissions accrued this month
INSERT INTO public.commissions (user_id, amount, status, accrued_at) VALUES
 (NULL, 4250.00,  'accrued',  date_trunc('month', now()) + interval '2 days'),
 (NULL, 6800.00,  'accrued',  date_trunc('month', now()) + interval '4 days'),
 (NULL, 3120.00,  'approved', date_trunc('month', now()) + interval '6 days'),
 (NULL, 9500.00,  'accrued',  date_trunc('month', now()) + interval '9 days'),
 (NULL, 2750.00,  'paid',     date_trunc('month', now()) + interval '11 days'),
 (NULL, 5400.00,  'accrued',  date_trunc('month', now()) + interval '14 days'),
 (NULL, 7300.00,  'approved', date_trunc('month', now()) + interval '16 days'),
 (NULL, 4880.00,  'accrued',  date_trunc('month', now()) + interval '19 days');

-- Tasks (assigned_to set to NULL; bootstrap_owner() reassigns two)
INSERT INTO public.tasks (title, description, status, priority, due_at) VALUES
 ('Review weekly invoice run',     'Check 12 invoices scheduled to send Friday', 'open',  'high',   now() + interval '2 days'),
 ('Approve commission payouts',    'Sign off on accrued commissions for the month','open','urgent', now() + interval '1 day'),
 ('Call Cloud9 about negotiation', 'Follow up on rebuild proposal',               'open',  'normal', now() + interval '3 days'),
 ('1:1 with head of sales',        'Monthly KPI review',                          'open',  'normal', now() + interval '5 days'),
 ('Sign Limpopo Bank NDA',         'Returned from legal',                         'open',  'high',   now() + interval '1 day'),
 ('Review Echo Health proposal',   'Final read before sending',                   'open',  'high',   now() + interval '2 days');

-- Playbooks pinned for owner
INSERT INTO public.playbooks (title, body, pinned_for_role) VALUES
 ('Weekly owner rhythm', 'Monday: pipeline review. Wednesday: invoice run. Friday: KPI check.', 'owner'),
 ('Closing a deal',      'Confirm scope, lock retainer, send contract via DocuSign within 24h.', 'owner'),
 ('Handling a churn risk','Schedule retention call within 48h. Discount only as a last resort.', 'owner'),
 ('Monthly close',       'All invoices sent by 25th; commissions approved by 28th; payroll on the 30th.', 'owner');

-- Monthly KPI reports for current month — 6 staff
INSERT INTO public.monthly_reports (staff_name, role, period_month, kpi_target, kpi_actual) VALUES
 ('Thabo Mokoena',   'Head of Sales',   date_trunc('month', now())::date, 400000, 425000),
 ('Naledi Khumalo',  'Field Agent',     date_trunc('month', now())::date, 120000, 88000),
 ('Sipho Dlamini',   'Field Agent',     date_trunc('month', now())::date, 120000, 142000),
 ('Lerato Mahlangu', 'CPC',             date_trunc('month', now())::date, 150000, 156000),
 ('Karabo Nkosi',    'Head of Tech',    date_trunc('month', now())::date, 200000, 198000),
 ('Refilwe Mashaba', 'Field Agent',     date_trunc('month', now())::date, 120000, 64000);
