-- =============================================================================
-- REFINE TENANT SETTINGS
-- =============================================================================
-- Remove unused tenant.features column and move operational strategy into settings.
-- The application now stores inventory mode, service workflow, AI behavior,
-- and dashboard/supply preferences in tenant.settings as the single source of truth.

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
      SET settings = (
        COALESCE(settings, '{}'::jsonb)
        - 'ai_style'
        || jsonb_build_object(
          'inventory_mode', COALESCE(to_jsonb(inventory_mode), '"unit"'::jsonb),
          'service_workflow', COALESCE(to_jsonb(service_workflow), '"pickup"'::jsonb)
        )
      );

    ALTER TABLE public.tenants
      ALTER COLUMN settings SET DEFAULT '{
        "inventory_mode": "unit",
        "service_workflow": "pickup",
        "dashboard_focus": "revenue",
        "supply_logic": "local"
      }'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'inventory_mode'
  ) THEN
    ALTER TABLE public.tenants
      DROP COLUMN inventory_mode;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'service_workflow'
  ) THEN
    ALTER TABLE public.tenants
      DROP COLUMN service_workflow;
  END IF;
END $$;

COMMENT ON COLUMN public.tenants.settings IS 'Stores operational preferences such as inventory mode, service workflow, dashboard focus, and supply chain logic.';
