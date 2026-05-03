-- =============================================================================
-- RENAME TENANT DISPLAY NAME
-- =============================================================================
-- Rename tenants.name to tenants.business_name so the schema uses a clearer
-- business-facing field name everywhere.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'name'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'business_name'
  ) THEN
    ALTER TABLE public.tenants
      RENAME COLUMN name TO business_name;
  END IF;
END $$;
ALTER TABLE public.tenants
  ALTER COLUMN business_name SET NOT NULL;

COMMENT ON COLUMN public.tenants.business_name IS 'Legal or trade name of the business tenant.';
