ALTER TABLE public.platform_settings
ADD COLUMN IF NOT EXISTS smtp_host text,
ADD COLUMN IF NOT EXISTS smtp_port integer NOT NULL DEFAULT 587,
ADD COLUMN IF NOT EXISTS smtp_secure boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS smtp_user text,
ADD COLUMN IF NOT EXISTS smtp_password text,
ADD COLUMN IF NOT EXISTS smtp_from_name text,
ADD COLUMN IF NOT EXISTS smtp_from_email text;

COMMENT ON COLUMN public.platform_settings.smtp_host IS
  'Nodemailer SMTP host configured by the super admin.';
COMMENT ON COLUMN public.platform_settings.smtp_port IS
  'Nodemailer SMTP port configured by the super admin.';
COMMENT ON COLUMN public.platform_settings.smtp_secure IS
  'Whether Nodemailer should use a secure SMTP connection.';
COMMENT ON COLUMN public.platform_settings.smtp_user IS
  'Nodemailer SMTP username configured by the super admin.';
COMMENT ON COLUMN public.platform_settings.smtp_password IS
  'Nodemailer SMTP password configured by the super admin.';
COMMENT ON COLUMN public.platform_settings.smtp_from_name IS
  'Display name used for outgoing Nodemailer emails.';
COMMENT ON COLUMN public.platform_settings.smtp_from_email IS
  'From email address used for outgoing Nodemailer emails.';