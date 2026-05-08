-- Create roles table for tenant-scoped role templates
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_roles_tenant_id ON public.roles(tenant_id);

-- Ensure updated_at is set automatically on update
DROP TRIGGER IF EXISTS set_timestamp_roles ON public.roles;
CREATE TRIGGER set_timestamp_roles
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Enable RLS and apply tenant isolation policy
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant isolation for roles" ON public.roles;
CREATE POLICY "Tenant isolation for roles" ON public.roles
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );
