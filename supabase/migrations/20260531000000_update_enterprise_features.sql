-- 20260531000000_update_enterprise_features.sql
-- Add "Multi-Branch Management" feature exclusively to the Enterprise plan

-- Update Enterprise plan
UPDATE public.subscription_plans
SET features = jsonb_set(
  features,
  '{admin_controls}',
  (COALESCE(features->'admin_controls', '{}'::jsonb)) || '{"Multi-Branch Management": true}'::jsonb,
  true
)
WHERE name = 'Enterprise';

-- Update Basic and Business plans to explicitly disable the feature
UPDATE public.subscription_plans
SET features = jsonb_set(
  features,
  '{admin_controls}',
  (COALESCE(features->'admin_controls', '{}'::jsonb)) || '{"Multi-Branch Management": false}'::jsonb,
  true
)
WHERE name IN ('Basic', 'Business');
