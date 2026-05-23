-- Add suspend comment column so tenant suspension reasons are stored directly on the tenants table
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS suspend_comment TEXT;

COMMENT ON COLUMN public.tenants.suspend_comment IS 'Admin-provided reason for suspending a tenant account.';
