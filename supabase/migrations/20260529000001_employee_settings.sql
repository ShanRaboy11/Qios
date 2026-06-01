-- =============================================================================
-- EMPLOYEE SETTINGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.employee_settings (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    terminal TEXT NOT NULL DEFAULT 'counter-1',
    default_view TEXT NOT NULL DEFAULT 'scanner',
    auto_logoff_minutes INTEGER NOT NULL DEFAULT 10,
    quick_pin_hash TEXT,
    sound_queue BOOLEAN NOT NULL DEFAULT true,
    sound_scan BOOLEAN NOT NULL DEFAULT true,
    sound_stock BOOLEAN NOT NULL DEFAULT false,
    notify_email BOOLEAN NOT NULL DEFAULT true,
    notify_push BOOLEAN NOT NULL DEFAULT true,
    weekly_schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_timestamp_employee_settings ON public.employee_settings;
CREATE TRIGGER set_timestamp_employee_settings
    BEFORE UPDATE ON public.employee_settings
    FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

ALTER TABLE public.employee_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employee can read own settings" ON public.employee_settings;
CREATE POLICY "Employee can read own settings" ON public.employee_settings
    FOR SELECT TO authenticated
    USING (
        profile_id = auth.uid()
        OR (auth.jwt() ->> 'user_role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Employee can insert own settings" ON public.employee_settings;
CREATE POLICY "Employee can insert own settings" ON public.employee_settings
    FOR INSERT TO authenticated
    WITH CHECK (
        profile_id = auth.uid()
        OR (auth.jwt() ->> 'user_role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Employee can update own settings" ON public.employee_settings;
CREATE POLICY "Employee can update own settings" ON public.employee_settings
    FOR UPDATE TO authenticated
    USING (
        profile_id = auth.uid()
        OR (auth.jwt() ->> 'user_role') = 'super_admin'
    )
    WITH CHECK (
        profile_id = auth.uid()
        OR (auth.jwt() ->> 'user_role') = 'super_admin'
    );

INSERT INTO public.employee_settings (
    profile_id,
    terminal,
    default_view,
    auto_logoff_minutes,
    sound_queue,
    sound_scan,
    sound_stock,
    notify_email,
    notify_push,
    weekly_schedule
)
SELECT
    p.id,
    'counter-1',
    'scanner',
    10,
    true,
    true,
    false,
    true,
        true,
        '[
            {"day":"Monday","enabled":true,"start":"09:00","end":"17:00"},
            {"day":"Tuesday","enabled":true,"start":"09:00","end":"17:00"},
            {"day":"Wednesday","enabled":true,"start":"09:00","end":"17:00"},
            {"day":"Thursday","enabled":true,"start":"09:00","end":"17:00"},
            {"day":"Friday","enabled":true,"start":"09:00","end":"17:00"},
            {"day":"Saturday","enabled":true,"start":"09:00","end":"15:00"},
            {"day":"Sunday","enabled":false,"start":"09:00","end":"17:00"}
        ]'::jsonb
FROM public.profiles p
ON CONFLICT (profile_id) DO NOTHING;

COMMENT ON TABLE public.employee_settings IS 'Stores per-employee workspace preferences, quick access behavior, and notification toggles.';