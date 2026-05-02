-- =============================================================================
-- REFINE TENANT SETTINGS
-- =============================================================================
-- Remove unused tenant.features column and drop ai_style from settings shape.
-- The application now derives AI behavior from the subscription plan and keeps
-- only explicit operational preferences in tenant.settings.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'features'
  ) THEN
    ALTER TABLE public.tenants
      DROP COLUMN features;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'settings'
  ) THEN
    UPDATE public.tenants
      SET settings = COALESCE(settings, '{}'::jsonb) - 'ai_style';

    ALTER TABLE public.tenants
      ALTER COLUMN settings SET DEFAULT '{
        "dashboard_focus": "revenue",
        "supply_logic": "local"
      }'::jsonb;
  END IF;
END $$;

COMMENT ON COLUMN public.tenants.settings IS 'Stores operational preferences such as dashboard focus and supply chain logic.';
