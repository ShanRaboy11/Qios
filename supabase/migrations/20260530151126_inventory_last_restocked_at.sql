-- Add last_restocked_at to inventory_items
ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS last_restocked_at TIMESTAMPTZ;
