-- Add inventory_mode and critical_stock_threshold to inventory_items
ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS inventory_mode public.inventory_mode_enum NOT NULL DEFAULT 'unit',
ADD COLUMN IF NOT EXISTS critical_stock_threshold NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Set a default for critical_stock_threshold based on low_stock_threshold for existing data
UPDATE public.inventory_items 
SET critical_stock_threshold = low_stock_threshold / 2 
WHERE critical_stock_threshold = 0 AND low_stock_threshold > 0;
