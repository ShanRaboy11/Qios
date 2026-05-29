-- =============================================================================
-- FIX EMPLOYEE USERNAME HANDLING FOR ROLE MANAGEMENT
-- =============================================================================

-- Keep the profile shape compatible with employee onboarding and role assignment.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Re-assert the safe auth.users trigger so signup / employee creation does not
-- depend on a direct NEW.username field.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name text;
  meta_tenant_id uuid := NULL;
  meta_app_role_id uuid := NULL;
  meta_username text := NULL;
BEGIN
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();