-- =============================================================================
-- ONBOARDING STATUS + AUTH CLEANUP
-- =============================================================================

DO $$
BEGIN
  ALTER TYPE public.tenant_status_enum ADD VALUE IF NOT EXISTS 'onboarding';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Cleanup helper for stale auth users.
-- Schedule this with pg_cron if the extension is enabled, or invoke the same
-- SQL from a Supabase Edge Function on a timer.
CREATE OR REPLACE FUNCTION public.cleanup_unconfirmed_auth_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  DELETE FROM auth.users
  WHERE email_confirmed_at IS NULL
    AND created_at < NOW() - INTERVAL '48 hours';
END;
$$;

-- Example pg_cron schedule (uncomment if pg_cron is enabled in your project):
-- SELECT cron.schedule(
--   'cleanup-unconfirmed-auth-users',
--   '0 */6 * * *',
--   $$SELECT public.cleanup_unconfirmed_auth_users();$$
-- );
