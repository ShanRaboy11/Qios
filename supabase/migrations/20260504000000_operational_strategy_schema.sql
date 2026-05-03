-- =============================================================================
-- OPERATIONAL STRATEGY SCHEMA UPDATES
-- =============================================================================

DO $$
BEGIN
  CREATE TYPE public.subscription_plan_enum AS ENUM ('basic', 'business', 'enterprise');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.service_workflow_enum AS ENUM ('pickup', 'dine_in');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TYPE public.inventory_mode_enum RENAME VALUE 'measurement' TO 'recipe';
EXCEPTION
  WHEN invalid_parameter_value THEN NULL;
END $$;

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
      ALTER COLUMN subscription_plan TYPE public.subscription_plan_enum
      USING (
        CASE subscription_plan
          WHEN 'starter' THEN 'basic'
          WHEN 'growth' THEN 'business'
          WHEN 'enterprises' THEN 'enterprise'
          WHEN 'basic' THEN 'basic'
          WHEN 'business' THEN 'business'
          WHEN 'enterprise' THEN 'enterprise'
          ELSE 'basic'
        END
      )::public.subscription_plan_enum,
      ALTER COLUMN subscription_plan SET DEFAULT 'basic',
      ALTER COLUMN subscription_plan SET NOT NULL;
  ELSE
    ALTER TABLE public.tenants
      ADD COLUMN subscription_plan public.subscription_plan_enum NOT NULL DEFAULT 'basic';
  END IF;
END $$;

ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS service_workflow public.service_workflow_enum NOT NULL DEFAULT 'pickup',
ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{
  "ai_style": "passive", 
  "dashboard_focus": "revenue", 
  "supply_logic": "local"
}'::jsonb;

ALTER TABLE public.tenants
  ALTER COLUMN inventory_mode SET DEFAULT 'unit';

COMMENT ON COLUMN public.tenants.settings IS 'Stores AI behavior, analytics focus, and enterprise supply chain logic.';
