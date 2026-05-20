-- move 2fa data from tenant.settings jsonb to per-user columns in profiles
-- this ensures each user has their own independent 2fa configuration

alter table public.profiles
  add column if not exists two_factor_enabled boolean not null default false,
  add column if not exists has_authenticator boolean not null default false,
  add column if not exists has_email_2fa boolean not null default false,
  add column if not exists totp_secret_encrypted text,
  add column if not exists recovery_codes_hashed text[],
  add column if not exists recovery_codes_encrypted text,
  add column if not exists recovery_codes_generated_at timestamptz,
  add column if not exists authenticator_updated_at timestamptz,
  add column if not exists email_2fa_updated_at timestamptz,
  add column if not exists login_email_code_hashed text,
  add column if not exists login_email_code_expires_at timestamptz;

-- update the trigger so newly created users always get these defaults
-- (the add column if not exists already handles existing users via the default value)

-- comment: all 2fa fields default to false/null so existing users are unaffected
-- and must explicitly opt in to 2fa through the security settings page.
