-- =============================================================================
-- SYSTEM ACTIVITY LOGS
-- Platform-level audit trail of all significant actions across all tenants.
-- Readable only by super_admins. Writes go through the service-role client.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.system_activity_logs (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Actor (snapshotted so records survive profile deletions)
    actor_id            UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_name          TEXT        NOT NULL DEFAULT 'System',
    actor_role          TEXT        NOT NULL DEFAULT 'system',
    -- Action
    action_type         TEXT        NOT NULL CHECK (action_type IN (
                                        'CREATE', 'UPDATE', 'DELETE',
                                        'LOGIN', 'LOGOUT', 'REFUND', 'SYSTEM'
                                    )),
    description         TEXT        NOT NULL,
    -- Target
    target_tenant_id    UUID        REFERENCES public.tenants(id) ON DELETE SET NULL,
    target_tenant_name  TEXT,
    -- Extra structured data (before/after, IP addresses, etc.)
    metadata            JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_sal_created_at        ON public.system_activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sal_actor_id          ON public.system_activity_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_sal_target_tenant_id  ON public.system_activity_logs (target_tenant_id);
CREATE INDEX IF NOT EXISTS idx_sal_action_type       ON public.system_activity_logs (action_type);

-- RLS: only super_admins may SELECT; inserts use the service-role key (bypasses RLS)
ALTER TABLE public.system_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admins can read system activity logs" ON public.system_activity_logs;
CREATE POLICY "super_admins can read system activity logs"
    ON public.system_activity_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = 'super_admin'
        )
    );
