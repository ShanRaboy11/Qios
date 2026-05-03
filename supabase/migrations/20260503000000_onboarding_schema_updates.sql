-- =============================================================================
-- ONBOARDING SCHEMA UPDATES - Add missing fields for subscription and features
-- =============================================================================
-- Note: The following fields already exist from previous migrations:
-- - status (enum: pending, approved, rejected) from migration 20260427
-- - verification_doc_urls (JSONB) from migration 20260501
-- - admin_comments (TEXT) from migration 20260501
-- - inventory_mode (enum) from base schema
-- - name (TEXT) - stores business name

-- Add missing columns to tenants table for onboarding
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS business_email TEXT,
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'starter',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{}';

-- Create index for business_email lookups
CREATE INDEX IF NOT EXISTS idx_tenants_business_email ON public.tenants(business_email);
