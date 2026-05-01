-- =============================================================================
-- ADD PHONE NUMBER TO AUTH-LINKED PROFILES
-- =============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name text;
  extracted_phone text;
BEGIN
  extracted_name := 'New User';

  IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    extracted_name := NEW.raw_user_meta_data->>'full_name';
  ELSIF NEW.email IS NOT NULL AND NEW.email != '' THEN
    extracted_name := split_part(NEW.email, '@', 1);
  END IF;

  IF NEW.raw_user_meta_data IS NOT NULL THEN
    extracted_phone := COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'phone_number', ''),
      NULLIF(NEW.raw_user_meta_data->>'contact_number', '')
    );
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, full_name, phone_number, role)
    VALUES (
      NEW.id,
      extracted_name,
      extracted_phone,
      'employee'::public.profile_role_enum
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
