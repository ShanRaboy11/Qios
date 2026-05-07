-- =============================================================================
-- CASCADE DELETION OF USER DATA FROM AUTH.USERS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_auth_user_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, storage
AS $$
DECLARE
    v_tenant_id uuid;
    v_role public.profile_role_enum;
BEGIN
    -- 1. Identify the user's tenant & role from their profile.
    -- (We do this BEFORE DELETE, so the profile still exists).
    SELECT tenant_id, role INTO v_tenant_id, v_role
    FROM public.profiles
    WHERE id = OLD.id;

    -- 2. If the user was an admin with an associated tenant, delete the whole tenant.
    -- Since the base schema is configured with ON DELETE CASCADE on almost all
    -- dependent tables (profiles, categories, menu_items, inventory_items, orders, etc.),
    -- deleting the tenant record automatically wipes all of those sub-records as well.
    IF v_tenant_id IS NOT NULL AND v_role = 'admin' THEN
        DELETE FROM public.tenants WHERE id = v_tenant_id;
    END IF;

    -- Also catch any stranded onboarding tenant linked to their email directly,
    -- in case the profile link process failed but tenant was created.
    IF OLD.email IS NOT NULL THEN
        DELETE FROM public.tenants WHERE business_email = OLD.email;
    END IF;

    -- 3. Delete the user's uploaded documents in the verification-docs bucket.
    -- The bucket structure stores files at `{user_id}/{filename}`.
    -- Deleting rows from storage.objects makes them inaccessible and allows
    -- the Supabase storage garbage collector to prune the physical files.
    DELETE FROM storage.objects 
    WHERE bucket_id = 'verification-docs' 
      AND name LIKE OLD.id::text || '/%';

    RETURN OLD;
END;
$$;

-- Attach the function to auth.users BEFORE DELETE
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
    BEFORE DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_user_deletion();
