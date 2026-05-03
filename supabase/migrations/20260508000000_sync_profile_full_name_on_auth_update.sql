-- =============================================================================
-- SYNC PROFILE FULL NAME WHEN AUTH METADATA CHANGES
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_auth_user_metadata_update()
RETURNS TRIGGER AS $$
DECLARE
  synced_name text;
BEGIN
  synced_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'display_name',
    NULLIF(split_part(NEW.email, '@', 1), ''),
    'New User'
  );

  UPDATE public.profiles
  SET full_name = synced_name,
      updated_at = now()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_metadata_updated ON auth.users;
CREATE TRIGGER on_auth_user_metadata_updated
  AFTER UPDATE OF raw_user_meta_data, email ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_auth_user_metadata_update();