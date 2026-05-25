-- =============================================================================
-- ADD location_count COLUMN TO TENANTS
-- =============================================================================
-- Tracks how many physical locations/branches/stores the tenant operates.
-- Defaults to 1 (every tenant has at least one location).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'location_count'
  ) THEN
    ALTER TABLE public.tenants
      ADD COLUMN location_count integer NOT NULL DEFAULT 1;
  END IF;
END $$;

COMMENT ON COLUMN public.tenants.location_count IS 'Number of physical store locations/branches the tenant operates.';
