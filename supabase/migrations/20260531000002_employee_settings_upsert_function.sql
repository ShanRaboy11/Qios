-- =============================================================================
-- EMPLOYEE SETTINGS UPSERT FUNCTION
-- =============================================================================

DROP FUNCTION IF EXISTS public.save_employee_operational_settings(
    INTEGER,
    TEXT,
    BOOLEAN,
    BOOLEAN,
    UUID,
    TEXT,
    BOOLEAN,
    BOOLEAN,
    BOOLEAN,
    TEXT,
    JSONB
);

CREATE OR REPLACE FUNCTION public.save_employee_operational_settings(
    p_auto_logoff_minutes INTEGER,
    p_default_view TEXT,
    p_notify_email BOOLEAN,
    p_notify_push BOOLEAN,
    p_profile_id UUID,
    p_quick_pin_hash TEXT,
    p_sound_queue BOOLEAN,
    p_sound_scan BOOLEAN,
    p_sound_stock BOOLEAN,
    p_terminal TEXT,
    p_weekly_schedule JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.role() <> 'service_role'
       AND auth.uid() <> p_profile_id
       AND COALESCE(auth.jwt() ->> 'user_role', '') <> 'super_admin' THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    INSERT INTO public.employee_settings (
        profile_id,
        terminal,
        default_view,
        auto_logoff_minutes,
        quick_pin_hash,
        sound_queue,
        sound_scan,
        sound_stock,
        notify_email,
        notify_push,
        weekly_schedule
    )
    VALUES (
        p_profile_id,
        p_terminal,
        p_default_view,
        p_auto_logoff_minutes,
        p_quick_pin_hash,
        p_sound_queue,
        p_sound_scan,
        p_sound_stock,
        p_notify_email,
        p_notify_push,
        p_weekly_schedule
    )
    ON CONFLICT (profile_id) DO UPDATE
    SET
        terminal = EXCLUDED.terminal,
        default_view = EXCLUDED.default_view,
        auto_logoff_minutes = EXCLUDED.auto_logoff_minutes,
        quick_pin_hash = EXCLUDED.quick_pin_hash,
        sound_queue = EXCLUDED.sound_queue,
        sound_scan = EXCLUDED.sound_scan,
        sound_stock = EXCLUDED.sound_stock,
        notify_email = EXCLUDED.notify_email,
        notify_push = EXCLUDED.notify_push,
        weekly_schedule = EXCLUDED.weekly_schedule;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_employee_operational_settings(
    INTEGER,
    TEXT,
    BOOLEAN,
    BOOLEAN,
    UUID,
    TEXT,
    BOOLEAN,
    BOOLEAN,
    BOOLEAN,
    TEXT,
    JSONB
) TO authenticated;