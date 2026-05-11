-- =============================================================================
-- FIX: CUSTOM ACCESS TOKEN HOOK FOR AUTHENTICATION
-- =============================================================================
-- The previous hook failed to correctly COALESCE claims when initializing.
-- This replaces the function to safely inject custom claims.

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

    -- Initialize or extract existing claims, defaulting to empty JSON object if null
    claims := COALESCE(event->'claims', '{}'::jsonb);

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
