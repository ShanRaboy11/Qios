-- =============================================================================
-- UPDATE AUTHENTICATION TRIGGERS & HOOKS (Fix for missing metadata)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    -- Attempt to get full_name from metadata, fallback to the email prefix if missing, then default fallback
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NULLIF(split_part(NEW.email, '@', 1), ''),
      'New User'
    ),
    -- By default, everyone is an employee. You elevate your real account manually.
    'employee'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-bind the trigger just in case
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();