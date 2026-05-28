ALTER TABLE public.platform_settings
ADD COLUMN IF NOT EXISTS email_notifications_enabled boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.platform_settings.email_notifications_enabled IS
  'Whether admin email notifications are enabled for the super admin account.';