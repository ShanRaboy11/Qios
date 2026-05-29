-- =============================================================================
-- EMPLOYEE AUDIT LOGS
-- Tenant-scoped audit trail of employee and admin actions within a restaurant.
-- Readable by tenant admins. Inserts use the service-role client (bypasses RLS).
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.employee_audit_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    -- Actor (snapshotted so records survive profile deletions)
    actor_id        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name      TEXT        NOT NULL DEFAULT 'System',
    actor_role      TEXT        NOT NULL DEFAULT 'system',
    -- Action
    action_type     TEXT        NOT NULL CHECK (action_type IN (
                                    'CREATE', 'UPDATE', 'DELETE',
                                    'LOGIN', 'LOGOUT', 'REFUND', 'SYSTEM'
                                )),
    description     TEXT        NOT NULL,
    -- Target (what was affected)
    target_type     TEXT,       -- e.g. 'staff', 'role', 'menu', 'order', 'auth', 'inventory'
    target_id       TEXT,       -- UUID or identifier of the affected record
    target_name     TEXT,       -- Human-readable name of the target
    -- Extra structured data (before/after, IP addresses, etc.)
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_eal_tenant_id    ON public.employee_audit_logs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_eal_created_at   ON public.employee_audit_logs (tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eal_actor_id     ON public.employee_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_eal_action_type  ON public.employee_audit_logs (tenant_id, action_type);
CREATE INDEX IF NOT EXISTS idx_eal_target_type  ON public.employee_audit_logs (tenant_id, target_type);

-- RLS: tenant admins (and super_admins) may SELECT; inserts use the service-role key
ALTER TABLE public.employee_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant admins can read employee audit logs" ON public.employee_audit_logs;
CREATE POLICY "Tenant admins can read employee audit logs"
    ON public.employee_audit_logs
    FOR SELECT
    USING (
        -- super admin sees all
        (auth.jwt() ->> 'user_role') = 'super_admin'
        OR
        -- tenant admin sees their own tenant's logs
        (
            (auth.jwt() ->> 'user_role') = 'admin'
            AND tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        )
    );

-- =============================================================================
-- DB TRIGGERS — auto-log mutations on profiles and roles tables
-- =============================================================================

-- Helper: get actor info from profiles
CREATE OR REPLACE FUNCTION get_employee_actor_info(p_user_id UUID)
RETURNS TABLE(out_actor_name TEXT, out_actor_role TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.full_name::TEXT,
        COALESCE(r.name, p.role::TEXT) AS actor_role
    FROM public.profiles p
    LEFT JOIN public.roles r ON r.id = p.app_role_id
    WHERE p.id = p_user_id
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- PROFILES — staff CRUD
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION log_employee_profile_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    -- Only log profiles that belong to a tenant
    IF NEW.tenant_id IS NULL THEN
        RETURN NEW;
    END IF;

    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        NEW.tenant_id, v_actor_id, v_actor_name, v_actor_role,
        'CREATE',
        'Added staff member: ' || NEW.full_name,
        'staff', NEW.id::TEXT, NEW.full_name,
        jsonb_build_object(
            'table',    'profiles',
            'role',     NEW.role,
            'username', NEW.username
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_employee_profile_update()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
    v_changes    JSONB;
BEGIN
    IF OLD.* IS NOT DISTINCT FROM NEW.* THEN
        RETURN NEW;
    END IF;
    IF NEW.tenant_id IS NULL AND OLD.tenant_id IS NULL THEN
        RETURN NEW;
    END IF;

    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    v_changes := '{}'::jsonb;
    IF OLD.full_name IS DISTINCT FROM NEW.full_name THEN
        v_changes := v_changes || jsonb_build_object('full_name',
            jsonb_build_object('old', OLD.full_name, 'new', NEW.full_name));
    END IF;
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        v_changes := v_changes || jsonb_build_object('role',
            jsonb_build_object('old', OLD.role, 'new', NEW.role));
    END IF;
    IF OLD.app_role_id IS DISTINCT FROM NEW.app_role_id THEN
        v_changes := v_changes || jsonb_build_object('app_role_id',
            jsonb_build_object('old', OLD.app_role_id, 'new', NEW.app_role_id));
    END IF;
    IF OLD.username IS DISTINCT FROM NEW.username THEN
        v_changes := v_changes || jsonb_build_object('username',
            jsonb_build_object('old', OLD.username, 'new', NEW.username));
    END IF;

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        COALESCE(NEW.tenant_id, OLD.tenant_id),
        v_actor_id, v_actor_name, v_actor_role,
        'UPDATE',
        'Updated staff profile: ' || NEW.full_name,
        'staff', NEW.id::TEXT, NEW.full_name,
        jsonb_build_object('table', 'profiles', 'changes', v_changes)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_employee_profile_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    IF OLD.tenant_id IS NULL THEN
        RETURN OLD;
    END IF;

    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        OLD.tenant_id, v_actor_id, v_actor_name, v_actor_role,
        'DELETE',
        'Removed staff member: ' || OLD.full_name,
        'staff', OLD.id::TEXT, OLD.full_name,
        jsonb_build_object(
            'table',    'profiles',
            'role',     OLD.role,
            'username', OLD.username
        )
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_eal_profile_insert ON public.profiles;
CREATE TRIGGER trg_eal_profile_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_employee_profile_insert();

DROP TRIGGER IF EXISTS trg_eal_profile_update ON public.profiles;
CREATE TRIGGER trg_eal_profile_update
    AFTER UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_employee_profile_update();

DROP TRIGGER IF EXISTS trg_eal_profile_delete ON public.profiles;
CREATE TRIGGER trg_eal_profile_delete
    AFTER DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION log_employee_profile_delete();

-- -------------------------------------------------------------------------
-- ROLES — role management
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION log_employee_role_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        NEW.tenant_id, v_actor_id, v_actor_name, v_actor_role,
        'CREATE',
        'Created role: ' || NEW.name,
        'role', NEW.id::TEXT, NEW.name,
        jsonb_build_object('table', 'roles', 'color', NEW.color)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_employee_role_update()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
    v_changes    JSONB;
BEGIN
    IF OLD.* IS NOT DISTINCT FROM NEW.* THEN RETURN NEW; END IF;

    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    v_changes := '{}'::jsonb;
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        v_changes := v_changes || jsonb_build_object('name',
            jsonb_build_object('old', OLD.name, 'new', NEW.name));
    END IF;
    IF OLD.color IS DISTINCT FROM NEW.color THEN
        v_changes := v_changes || jsonb_build_object('color',
            jsonb_build_object('old', OLD.color, 'new', NEW.color));
    END IF;
    IF OLD.permissions IS DISTINCT FROM NEW.permissions THEN
        v_changes := v_changes || jsonb_build_object('permissions',
            jsonb_build_object('old', OLD.permissions, 'new', NEW.permissions));
    END IF;

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        NEW.tenant_id, v_actor_id, v_actor_name, v_actor_role,
        'UPDATE',
        'Updated role: ' || NEW.name,
        'role', NEW.id::TEXT, NEW.name,
        jsonb_build_object('table', 'roles', 'changes', v_changes)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_employee_role_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id   UUID;
    v_actor_name TEXT;
    v_actor_role TEXT;
BEGIN
    v_actor_id := (auth.jwt() ->> 'sub')::uuid;
    SELECT out_actor_name, out_actor_role INTO v_actor_name, v_actor_role
    FROM get_employee_actor_info(v_actor_id);

    v_actor_name := COALESCE(v_actor_name, 'System');
    v_actor_role := COALESCE(v_actor_role, 'system');

    INSERT INTO public.employee_audit_logs (
        tenant_id, actor_id, actor_name, actor_role,
        action_type, description, target_type, target_id, target_name, metadata
    ) VALUES (
        OLD.tenant_id, v_actor_id, v_actor_name, v_actor_role,
        'DELETE',
        'Deleted role: ' || OLD.name,
        'role', OLD.id::TEXT, OLD.name,
        jsonb_build_object('table', 'roles', 'color', OLD.color)
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_eal_role_insert ON public.roles;
CREATE TRIGGER trg_eal_role_insert
    AFTER INSERT ON public.roles
    FOR EACH ROW EXECUTE FUNCTION log_employee_role_insert();

DROP TRIGGER IF EXISTS trg_eal_role_update ON public.roles;
CREATE TRIGGER trg_eal_role_update
    AFTER UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION log_employee_role_update();

DROP TRIGGER IF EXISTS trg_eal_role_delete ON public.roles;
CREATE TRIGGER trg_eal_role_delete
    AFTER DELETE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION log_employee_role_delete();
