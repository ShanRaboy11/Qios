-- Migration: remove 'voided' value from order_status_enum
-- Strategy:
-- 1) Convert any existing usages of 'voided' to 'cancelled'
-- 2) Create a new enum type without 'voided'
-- 3) Alter all columns using the old type to the new type using a text cast
-- 4) Drop the old enum type and rename the new one to the original name

BEGIN;

-- 1) Normalize existing data
UPDATE public.orders SET status = 'cancelled' WHERE status = 'voided';
UPDATE public.order_status_logs SET status_change = 'cancelled' WHERE status_change = 'voided';
UPDATE public.order_status_logs SET previous_status = 'cancelled' WHERE previous_status = 'voided';

-- 2) Create the new enum without 'voided'
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum_new') THEN
        CREATE TYPE public.order_status_enum_new AS ENUM ('pending', 'preparing', 'ready', 'served', 'cancelled');
    END IF;
END$$;

-- 3) Alter columns to use the new enum type
ALTER TABLE public.orders
    ALTER COLUMN status TYPE public.order_status_enum_new USING status::text::public.order_status_enum_new;

ALTER TABLE public.order_status_logs
    ALTER COLUMN status_change TYPE public.order_status_enum_new USING status_change::text::public.order_status_enum_new;

ALTER TABLE public.order_status_logs
    ALTER COLUMN previous_status TYPE public.order_status_enum_new USING previous_status::text::public.order_status_enum_new;

-- 4) Drop old enum and rename new type
-- Drop old type only if it exists and is not used anymore
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        -- Attempt to drop; this will fail if something still depends on it
        BEGIN
            DROP TYPE public.order_status_enum;
        EXCEPTION WHEN OTHERS THEN
            -- If drop failed, raise a useful message and continue
            RAISE NOTICE 'Could not drop old type order_status_enum, it may still be referenced by objects. Please review and drop manually.';
        END;
    END IF;
END$$;

-- Rename new type to canonical name (if the canonical name is free)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum_new') AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        ALTER TYPE public.order_status_enum_new RENAME TO order_status_enum;
    END IF;
END$$;

COMMIT;
