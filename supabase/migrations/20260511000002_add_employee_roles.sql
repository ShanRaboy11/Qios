-- =============================================================================
-- ADD EMPLOYEE ROLES AND PROXY USERNAME TO PROFILES
-- =============================================================================

-- 1. Add app_role_id and username columns to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS app_role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- 2. Update the handle_new_user trigger to extract tenant_id, app_role_id, and username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name text;
  meta_tenant_id uuid := NULL;
  meta_app_role_id uuid := NULL;
  meta_username text := NULL;
BEGIN
  -- 1. Safely calculate the name
  extracted_name := 'New User';
  
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
      extracted_name := NEW.raw_user_meta_data->>'full_name';
    END IF;
    
    IF NEW.raw_user_meta_data->>'tenant_id' IS NOT NULL THEN
      meta_tenant_id := (NEW.raw_user_meta_data->>'tenant_id')::uuid;
    END IF;
    
    IF NEW.raw_user_meta_data->>'app_role_id' IS NOT NULL THEN
      meta_app_role_id := (NEW.raw_user_meta_data->>'app_role_id')::uuid;
    END IF;

    IF NEW.raw_user_meta_data->>'username' IS NOT NULL THEN
      meta_username := NEW.raw_user_meta_data->>'username';
    END IF;
  END IF;

  IF extracted_name = 'New User' AND NEW.email IS NOT NULL AND NEW.email != '' THEN
    extracted_name := split_part(NEW.email, '@', 1);
  END IF;

  -- 2. Attempt the insertion inside a TRY/CATCH block
  BEGIN
    INSERT INTO public.profiles (id, full_name, role, tenant_id, app_role_id, username)
    VALUES (
      NEW.id,
      extracted_name,
      'employee'::public.profile_role_enum,
      meta_tenant_id,
      meta_app_role_id,
      meta_username
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
