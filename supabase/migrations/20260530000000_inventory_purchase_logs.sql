-- Add purchase pricing to inventory items and log stock purchase activity.

ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC(10,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.inventory_purchase_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_purchase_logs_tenant_created_at
    ON public.inventory_purchase_logs(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_purchase_logs_item_created_at
    ON public.inventory_purchase_logs(inventory_item_id, created_at DESC);

ALTER TABLE public.inventory_purchase_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation for inventory_purchase_logs" ON public.inventory_purchase_logs;
CREATE POLICY "Tenant isolation for inventory_purchase_logs" ON public.inventory_purchase_logs
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );
