-- tenant billing support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.tenant_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'other',
  display_name text NOT NULL,
  last4 text NOT NULL,
  exp_month text NOT NULL,
  exp_year text NOT NULL,
  cardholder_name text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tenant_payment_methods_last4_check CHECK (last4 ~ '^[0-9]{4}$')
);

CREATE TABLE IF NOT EXISTS public.tenant_billing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'PHP',
  status text NOT NULL DEFAULT 'paid',
  billing_date timestamptz NOT NULL DEFAULT now(),
  invoice_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_payment_methods_tenant_id
  ON public.tenant_payment_methods (tenant_id, is_default DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tenant_billing_history_tenant_id
  ON public.tenant_billing_history (tenant_id, billing_date DESC);

ALTER TABLE public.tenant_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_billing_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant payment methods are viewable by tenant members" ON public.tenant_payment_methods;
CREATE POLICY "Tenant payment methods are viewable by tenant members"
ON public.tenant_payment_methods
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_payment_methods.tenant_id)
      )
  )
);

DROP POLICY IF EXISTS "Tenant payment methods are mutable by tenant members" ON public.tenant_payment_methods;
CREATE POLICY "Tenant payment methods are mutable by tenant members"
ON public.tenant_payment_methods
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_payment_methods.tenant_id)
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_payment_methods.tenant_id)
      )
  )
);

DROP POLICY IF EXISTS "Tenant billing history is viewable by tenant members" ON public.tenant_billing_history;
CREATE POLICY "Tenant billing history is viewable by tenant members"
ON public.tenant_billing_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_billing_history.tenant_id)
      )
  )
);

DROP POLICY IF EXISTS "Tenant billing history is mutable by tenant members" ON public.tenant_billing_history;
CREATE POLICY "Tenant billing history is mutable by tenant members"
ON public.tenant_billing_history
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_billing_history.tenant_id)
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'super_admin'
        OR (profiles.role = 'admin' AND profiles.tenant_id = tenant_billing_history.tenant_id)
      )
  )
);
