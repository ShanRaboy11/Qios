-- =============================================================================
-- MAKE TENANT SUBSCRIPTION PLAN DYNAMIC
-- =============================================================================
-- Replace the restrictive enum-backed subscription_plan column with text so
-- any plan name from public.subscription_plans.name can be stored directly.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'subscription_plan'
  ) THEN
    ALTER TABLE public.tenants
      ALTER COLUMN subscription_plan DROP DEFAULT,
      ALTER COLUMN subscription_plan TYPE text
      USING subscription_plan::text,
      ALTER COLUMN subscription_plan SET DEFAULT NULL,
      ALTER COLUMN subscription_plan DROP NOT NULL;
  ELSE
    ALTER TABLE public.tenants
      ADD COLUMN subscription_plan text DEFAULT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'subscription_plan_enum'
  ) THEN
    DROP TYPE public.subscription_plan_enum;
  END IF;
EXCEPTION
  WHEN dependent_objects_still_exist THEN
    NULL;
END $$;

COMMENT ON COLUMN public.tenants.subscription_plan IS 'Stores the selected subscription plan name from public.subscription_plans.name.';