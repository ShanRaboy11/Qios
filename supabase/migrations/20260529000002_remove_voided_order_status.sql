-- Migration: remove 'voided' value from order_status_enum
-- Strategy:
-- 1) Convert any existing usages of 'voided' to 'cancelled'
-- 2) Create a new enum type without 'voided'
-- 3) Alter all columns using the old type to the new type using a text cast
-- 4) Drop the old enum type and rename the new one to the original name

BEGIN;

-- 1) Normalize existing data
UPDATE public.orders SET status = 'cancelled' WHERE status::text = 'voided';
UPDATE public.order_status_logs SET status_change = 'cancelled' WHERE status_change::text = 'voided';
UPDATE public.order_status_logs SET previous_status = 'cancelled' WHERE previous_status::text = 'voided';

-- 2) Create the new enum without 'voided'
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum_new') THEN
        CREATE TYPE public.order_status_enum_new AS ENUM ('pending', 'preparing', 'ready', 'served', 'cancelled');
    END IF;
END$$;

-- 3) Alter columns to use the new enum type
-- Must drop the views and trigger first because they depend on the column
DROP VIEW IF EXISTS public.v_active_orders;
DROP VIEW IF EXISTS public.v_daily_revenue;
DROP VIEW IF EXISTS public.v_staff_transaction_counts;
DROP TRIGGER IF EXISTS trg_log_order_status_change ON public.orders;
DROP INDEX IF EXISTS idx_orders_tenant_status;

ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.orders
    ALTER COLUMN status TYPE public.order_status_enum_new USING status::text::public.order_status_enum_new;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending'::public.order_status_enum_new;

ALTER TABLE public.order_status_logs
    ALTER COLUMN status_change TYPE public.order_status_enum_new USING status_change::text::public.order_status_enum_new;

ALTER TABLE public.order_status_logs
    ALTER COLUMN previous_status TYPE public.order_status_enum_new USING previous_status::text::public.order_status_enum_new;

CREATE TRIGGER trg_log_order_status_change
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

CREATE OR REPLACE VIEW public.v_active_orders WITH (security_invoker = true) AS
SELECT
    o.id,
    o.tenant_id,
    o.table_number,
    o.status,
    o.total_price,
    o.qr_hash,
    o.created_at,
    o.updated_at,
    json_agg(
        json_build_object(
            'order_item_id', oi.id,
            'menu_item_id',  oi.menu_item_id,
            'name',          mi.name,
            'quantity',      oi.quantity,
            'unit_price',    oi.unit_price,
            'notes',         oi.customization_notes,
            'modifiers',     (
                SELECT json_agg(json_build_object(
                    'name',             mo.name,
                    'additional_price', oim.additional_price
                ))
                FROM public.order_item_modifiers oim
                JOIN public.modifier_options mo ON mo.id = oim.modifier_option_id
                WHERE oim.order_item_id = oi.id
            )
        )
        ORDER BY oi.created_at
    ) AS items
FROM public.orders o
JOIN public.order_items oi ON oi.order_id = o.id
JOIN public.menu_items  mi ON mi.id = oi.menu_item_id
WHERE o.status IN ('pending', 'preparing', 'ready')
  AND o.payment_status = 'unpaid'
GROUP BY o.id;

COMMENT ON VIEW public.v_active_orders IS
    'Kitchen display board feed. security_invoker — RLS scopes to caller tenant automatically.';

CREATE INDEX IF NOT EXISTS idx_orders_tenant_status
    ON public.orders(tenant_id, status)
    WHERE status IN ('pending', 'preparing', 'ready');

CREATE OR REPLACE VIEW public.v_daily_revenue WITH (security_invoker = true) AS
SELECT
    tenant_id,
    (created_at AT TIME ZONE 'Asia/Manila')::DATE AS sale_date,
    payment_method,
    COUNT(*) FILTER (WHERE payment_status = 'paid')         AS total_transactions,
    SUM(total_price) FILTER (WHERE payment_status = 'paid') AS total_revenue,
    COUNT(*) FILTER (WHERE status = 'cancelled')            AS cancellations,
    COUNT(*) FILTER (WHERE status::text = 'voided')               AS voids
FROM public.orders
GROUP BY
    tenant_id,
    (created_at AT TIME ZONE 'Asia/Manila')::DATE,
    payment_method;

COMMENT ON VIEW public.v_daily_revenue IS
    'Grouped by Manila date. payment_method NULL group = unpaid/pending orders. By design.';

CREATE OR REPLACE VIEW public.v_staff_transaction_counts WITH (security_invoker = true) AS
SELECT
    osl.tenant_id,
    osl.staff_id,
    p.full_name,
    s.id         AS shift_id,
    s.opened_at  AS shift_start,
    s.closed_at  AS shift_end,
    COUNT(DISTINCT osl.order_id) AS orders_processed
FROM public.order_status_logs osl
JOIN public.profiles p ON p.id = osl.staff_id
LEFT JOIN public.shifts s
    ON  s.staff_id  = osl.staff_id
    AND s.tenant_id = osl.tenant_id
    AND osl.created_at BETWEEN s.opened_at AND COALESCE(s.closed_at, now())
WHERE osl.status_change = 'served'
GROUP BY osl.tenant_id, osl.staff_id, p.full_name,
         s.id, s.opened_at, s.closed_at;



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
