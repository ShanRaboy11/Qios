-- Add department and status columns to profiles table
ALTER TABLE "public"."profiles"
ADD COLUMN IF NOT EXISTS "department" TEXT,
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'Active' NOT NULL;

-- Update the handle_new_user trigger to support department and status from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name text;
  meta_tenant_id uuid := NULL;
  meta_app_role_id uuid := NULL;
  meta_username text := NULL;
  meta_department text := NULL;
  meta_status text := 'Active';
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

    IF NEW.raw_user_meta_data->>'department' IS NOT NULL THEN
      meta_department := NEW.raw_user_meta_data->>'department';
    END IF;

    IF NEW.raw_user_meta_data->>'status' IS NOT NULL THEN
      meta_status := NEW.raw_user_meta_data->>'status';
    END IF;
  END IF;

  IF extracted_name = 'New User' AND NEW.email IS NOT NULL AND NEW.email != '' THEN
    extracted_name := split_part(NEW.email, '@', 1);
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, full_name, role, tenant_id, app_role_id, username, department, status)
    VALUES (
      NEW.id,
      extracted_name,
      'employee'::public.profile_role_enum,
      meta_tenant_id,
      meta_app_role_id,
      meta_username,
      meta_department,
      meta_status
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
