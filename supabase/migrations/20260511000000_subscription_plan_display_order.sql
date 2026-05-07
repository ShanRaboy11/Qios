-- Add stable ordering to subscription plans and normalize names.

ALTER TABLE public.subscription_plans
ADD COLUMN IF NOT EXISTS display_order INT NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1 AS seq
  FROM public.subscription_plans
)
UPDATE public.subscription_plans sp
SET display_order = ranked.seq
FROM ranked
WHERE sp.id = ranked.id;

UPDATE public.subscription_plans
SET name = lower(trim(name))
WHERE name IS NOT NULL
  AND name <> lower(trim(name));
