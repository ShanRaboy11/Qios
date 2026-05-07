-- =============================================================================
-- FIX AUTH USER DELETE TRIGGER (REMOVE DIRECT STORAGE TABLE DELETE)
-- =============================================================================
-- Supabase blocks direct DELETEs from storage.objects. The previous trigger
-- raised: "Direct deletion from storage tables is not allowed. Use the Storage API instead."
-- This patch keeps tenant/profile cascade cleanup in-db and removes the unsupported
-- storage.objects delete so auth user deletion can complete successfully.

CREATE OR REPLACE FUNCTION public.handle_auth_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_tenant_id uuid;
    v_role public.profile_role_enum;
BEGIN
    -- Profile may or may not exist at delete time.
    SELECT tenant_id, role INTO v_tenant_id, v_role
    FROM public.profiles
    WHERE id = OLD.id;

    -- If an admin is deleted, remove the tenant; child rows cascade by FK.
    IF v_tenant_id IS NOT NULL AND v_role = 'admin' THEN
        DELETE FROM public.tenants WHERE id = v_tenant_id;
    END IF;

    -- Cleanup orphan onboarding records that were keyed by email.
    IF OLD.email IS NOT NULL THEN
        DELETE FROM public.tenants WHERE business_email = OLD.email;
    END IF;

    RETURN OLD;
END;
$$;
