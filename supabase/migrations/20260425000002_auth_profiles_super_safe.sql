-- =============================================================================
-- BULLETPROOF AUTHENTICATION TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name text;
BEGIN
  -- 1. Safely calculate the name without any complex inline COALESCE that might throw
  extracted_name := 'New User';
  
  IF NEW.raw_user_meta_data IS NOT NULL AND NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    extracted_name := NEW.raw_user_meta_data->>'full_name';
  ELSIF NEW.email IS NOT NULL AND NEW.email != '' THEN
    extracted_name := split_part(NEW.email, '@', 1);
  END IF;

  -- 2. Attempt the insertion inside a TRY/CATCH block (EXCEPTION in PL/pgSQL)
  -- This ensures that even if the profiles table insert completely fails, 
  -- it will NOT block Supabase Auth from creating the user!
  BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
      NEW.id,
      extracted_name,
      'employee'::public.profile_role_enum
    );
  EXCEPTION WHEN OTHERS THEN
    -- Swallow the error and print it to Postgres logs, but allow the user to be created.
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;