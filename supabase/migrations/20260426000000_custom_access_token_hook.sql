-- =============================================================================
-- CUSTOM ACCESS TOKEN HOOK FOR AUTHENTICATION
-- =============================================================================
-- This hook injects the custom claims (role and tenant_id) into the JWT payload.
-- It ensures that role-based access control and tenant routing can be securely 
-- implemented immediately without requiring additional client-side DB hits.

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    claims jsonb;
    user_role public.profile_role_enum;
    user_tenant_id uuid;
BEGIN
    -- Fetch the user profile corresponding to the auth token user
    SELECT role, tenant_id INTO user_role, user_tenant_id
    FROM public.profiles
    WHERE id = (event->>'user_id')::uuid;

    -- Initialize or extract existing claims
    claims := event->'claims';

    IF user_role IS NOT NULL THEN
        -- Inject the claims
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
        
        IF user_tenant_id IS NOT NULL THEN
            claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_tenant_id));
        END IF;

        -- Update the event with new claims
        event := jsonb_set(event, '{claims}', claims);
    END IF;

    RETURN event;
END;
$$;

-- Note: To fully activate this hook, the Super Admin must grant auth admin rights
-- to execute the function and register the hook in the Supabase Dashboard
-- under Authentication > Hooks > Custom Access Token.

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
-- Allow the hook to read the profiles table
REVOKE ALL ON TABLE public.profiles FROM supabase_auth_admin;
GRANT SELECT ON TABLE public.profiles TO supabase_auth_admin;
