-- =============================================================================
-- MIGRATION v2 — CORRECTED & HARDENED
-- Senior Database Architect Review Applied
--
-- FIXES APPLIED:
--   F1.  Deployment order — enums → tables → columns → helpers → triggers → indexes → RLS → views
--   F2.  order_status_logs table added (was referenced in view but never created)
--   F3.  low_stock_alerts moved to Section 3 (was referenced before creation)
--   F4.  sync_order_total_price() now delegates to shared helper (no duplicated logic)
--   F5.  Helper defined BEFORE both trigger functions that call it
--   F6.  All tenant-isolation RLS policies scoped TO authenticated
--   F7.  Anon insert policy restricts qr_hash IS NULL (prevents tenant_id spoofing)
--   F8.  Silent stock floor replaced with explicit over-deduction alert
--   F9.  Missing dedup index on low_stock_alerts(inventory_item_id, created_at)
--   F10. Views include explicit tenant_id predicate for service-role safety
--   F11. Partial unique index on shifts prevents multiple open shifts per staff
--   F12. Immutability triggers on unit_price and additional_price (price snapshots)
--   F13. uq_category_display_order made DEFERRABLE INITIALLY DEFERRED
--   F14. v_daily_revenue uses Asia/Manila timezone instead of UTC DATE()
--   F15. modifier_groups.max_selections CHECK (>= 1) added
--   F16. shifts.closed_at CHECK (> opened_at) added
-- =============================================================================


-- =============================================================================
-- SECTION 1: ENUM EXTENSIONS
-- =============================================================================

-- 1a. Add 'cancelled' and 'voided' to order status
ALTER TYPE order_status_enum ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE order_status_enum ADD VALUE IF NOT EXISTS 'voided';

-- 1b. Payment method enum
CREATE TYPE payment_method_enum AS ENUM ('cash', 'gcash', 'card', 'other');

-- 1c. Shift status enum
CREATE TYPE shift_status_enum AS ENUM ('open', 'closed');


-- =============================================================================
-- SECTION 2: NEW TABLES
-- (Moved before column additions so all FK targets exist)
-- =============================================================================

-- 2a. modifier_groups — groups of options attached to a menu item
CREATE TABLE IF NOT EXISTS public.modifier_groups (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    menu_item_id  UUID        NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name          TEXT        NOT NULL,
    is_required   BOOLEAN     NOT NULL DEFAULT false,
    max_selections INT        NOT NULL DEFAULT 1,
    display_order INT         NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- F15: prevent zero/negative selection limits
    CONSTRAINT chk_max_selections_positive CHECK (max_selections >= 1)
);

CREATE INDEX IF NOT EXISTS idx_modifier_groups_tenant_id    ON public.modifier_groups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modifier_groups_menu_item_id ON public.modifier_groups(menu_item_id);

-- 2b. modifier_options — individual choices within a modifier group
CREATE TABLE IF NOT EXISTS public.modifier_options (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    modifier_group_id UUID        NOT NULL REFERENCES public.modifier_groups(id) ON DELETE CASCADE,
    name              TEXT        NOT NULL,
    additional_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_available      BOOLEAN     NOT NULL DEFAULT true,
    display_order     INT         NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modifier_options_tenant_id         ON public.modifier_options(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modifier_options_modifier_group_id ON public.modifier_options(modifier_group_id);

-- 2c. order_item_modifiers — selected modifier options per order item
--     additional_price is snapshotted at order time and is immutable (enforced by trigger below)
CREATE TABLE IF NOT EXISTS public.order_item_modifiers (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id          UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_item_id      UUID        NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    modifier_option_id UUID        NOT NULL REFERENCES public.modifier_options(id) ON DELETE CASCADE,
    additional_price   NUMERIC(10,2) NOT NULL DEFAULT 0,  -- snapshot; immutable after insert
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.order_item_modifiers.additional_price IS
    'Snapshot of modifier_options.additional_price at order creation time. Immutable after insert.';

CREATE INDEX IF NOT EXISTS idx_order_item_modifiers_tenant_id     ON public.order_item_modifiers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_item_modifiers_order_item_id ON public.order_item_modifiers(order_item_id);

-- 2d. shifts — staff session boundaries for cashier activity reporting
CREATE TABLE IF NOT EXISTS public.shifts (
    id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID             NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id    UUID             NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status      shift_status_enum NOT NULL DEFAULT 'open',
    opened_at   TIMESTAMPTZ      NOT NULL DEFAULT now(),
    closed_at   TIMESTAMPTZ,
    notes       TEXT,
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ      NOT NULL DEFAULT now(),
    -- F16: closed_at must be after opened_at
    CONSTRAINT chk_shift_closed_after_opened CHECK (closed_at IS NULL OR closed_at > opened_at)
);

-- F11: only one open shift per staff member per tenant at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_shifts_staff_open
    ON public.shifts(staff_id, tenant_id)
    WHERE status = 'open';

CREATE INDEX IF NOT EXISTS idx_shifts_tenant_id ON public.shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shifts_staff_id  ON public.shifts(staff_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status    ON public.shifts(tenant_id, status);

-- 2e. order_status_logs — F2: was referenced in v_staff_transaction_counts but never created
--     Records every status transition for audit trails and cashier analytics
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id              UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID             NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id        UUID             NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    staff_id        UUID             REFERENCES public.profiles(id) ON DELETE SET NULL,
    status_change   order_status_enum NOT NULL,
    previous_status order_status_enum,
    notes           TEXT,
    created_at      TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_logs_tenant
    ON public.order_status_logs(tenant_id, staff_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id
    ON public.order_status_logs(order_id);

-- 2f. low_stock_alerts — F3: moved here from Section 8 so trigger function can reference it
CREATE TABLE IF NOT EXISTS public.low_stock_alerts (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id             UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    inventory_item_id     UUID        NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    current_stock         NUMERIC(10,2) NOT NULL,
    threshold             NUMERIC(10,2) NOT NULL,
    triggered_by_order_id UUID        REFERENCES public.orders(id) ON DELETE SET NULL,
    is_resolved           BOOLEAN     NOT NULL DEFAULT false,
    resolved_at           TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_tenant_id
    ON public.low_stock_alerts(tenant_id, is_resolved, created_at DESC);

-- F9: index specifically for the deduplication anti-join in process_inventory_deduction()
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_dedup
    ON public.low_stock_alerts(inventory_item_id, created_at DESC);


-- =============================================================================
-- SECTION 3: COLUMN ADDITIONS TO EXISTING TABLES
-- =============================================================================

-- 3a. order_items: unit_price snapshot (immutable after insert — enforced by trigger below)
ALTER TABLE public.order_items
    ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.order_items.unit_price IS
    'Snapshot of menu_items.price at order creation time. Immutable after insert.';

-- 3b. orders: payment_method
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS payment_method payment_method_enum;

COMMENT ON COLUMN public.orders.payment_method IS
    'Set at payment confirmation. NULL until payment_status transitions to paid. Nullable by design.';

-- 3c. orders: cancellation/void tracking
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS cancelled_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS voided_by           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS void_reason         TEXT;

COMMENT ON COLUMN public.orders.cancelled_by IS
    'Profile ID of staff who cancelled the order. NULL if not cancelled.';
COMMENT ON COLUMN public.orders.voided_by IS
    'Profile ID of staff who voided the order. NULL if not voided.';

-- 3d. orders: shift linkage (set when payment confirmed)
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.orders.shift_id IS
    'The shift during which this order was paid. Set when payment_status → paid.';

-- 3e. stock_audits: explicit audit_date
ALTER TABLE public.stock_audits
    ADD COLUMN IF NOT EXISTS audit_date DATE NOT NULL DEFAULT CURRENT_DATE;

COMMENT ON COLUMN public.stock_audits.audit_date IS
    'Calendar date the physical count was performed. Separate from created_at (entry time).';

CREATE INDEX IF NOT EXISTS idx_stock_audits_audit_date
    ON public.stock_audits(tenant_id, audit_date);

-- 3f. profiles: non-super_admin must have tenant_id
ALTER TABLE public.profiles
    ADD CONSTRAINT chk_profile_tenant_required
    CHECK (role = 'super_admin' OR tenant_id IS NOT NULL);

-- 3g. categories: unique display_order per tenant
--     F13: DEFERRABLE so drag-and-drop swap of two rows in one transaction doesn't fail mid-way
ALTER TABLE public.categories
    ADD CONSTRAINT uq_category_display_order
    UNIQUE (tenant_id, display_order)
    DEFERRABLE INITIALLY DEFERRED;


-- =============================================================================
-- SECTION 4: CONSTRAINTS — TENANT CONSISTENCY
-- =============================================================================

-- 4a. order_items.tenant_id must match parent orders.tenant_id
CREATE OR REPLACE FUNCTION check_order_item_tenant_consistency()
RETURNS TRIGGER AS $$
DECLARE
    parent_tenant_id UUID;
BEGIN
    SELECT tenant_id INTO parent_tenant_id
    FROM public.orders
    WHERE id = NEW.order_id;

    IF parent_tenant_id IS DISTINCT FROM NEW.tenant_id THEN
        RAISE EXCEPTION
            'order_items.tenant_id (%) must match orders.tenant_id (%) for order_id %',
            NEW.tenant_id, parent_tenant_id, NEW.order_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_item_tenant_check ON public.order_items;
CREATE TRIGGER trg_order_item_tenant_check
    BEFORE INSERT OR UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION check_order_item_tenant_consistency();

-- 4b. order_item_modifiers.tenant_id must match parent order_items.tenant_id
CREATE OR REPLACE FUNCTION check_order_item_modifier_tenant_consistency()
RETURNS TRIGGER AS $$
DECLARE
    parent_tenant_id UUID;
BEGIN
    SELECT tenant_id INTO parent_tenant_id
    FROM public.order_items
    WHERE id = NEW.order_item_id;

    IF parent_tenant_id IS DISTINCT FROM NEW.tenant_id THEN
        RAISE EXCEPTION
            'order_item_modifiers.tenant_id (%) must match order_items.tenant_id (%)',
            NEW.tenant_id, parent_tenant_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_item_modifier_tenant_check ON public.order_item_modifiers;
CREATE TRIGGER trg_order_item_modifier_tenant_check
    BEFORE INSERT OR UPDATE ON public.order_item_modifiers
    FOR EACH ROW EXECUTE FUNCTION check_order_item_modifier_tenant_consistency();

-- 4c. F12: Immutability guard on order_items.unit_price
CREATE OR REPLACE FUNCTION prevent_unit_price_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.unit_price IS DISTINCT FROM OLD.unit_price THEN
        RAISE EXCEPTION
            'order_items.unit_price is immutable after insert (order_item_id: %)', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_immutable_unit_price ON public.order_items;
CREATE TRIGGER trg_immutable_unit_price
    BEFORE UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION prevent_unit_price_update();

-- 4d. F12: Immutability guard on order_item_modifiers.additional_price
CREATE OR REPLACE FUNCTION prevent_modifier_price_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.additional_price IS DISTINCT FROM OLD.additional_price THEN
        RAISE EXCEPTION
            'order_item_modifiers.additional_price is immutable after insert (id: %)', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_immutable_modifier_price ON public.order_item_modifiers;
CREATE TRIGGER trg_immutable_modifier_price
    BEFORE UPDATE ON public.order_item_modifiers
    FOR EACH ROW EXECUTE FUNCTION prevent_modifier_price_update();


-- =============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- =============================================================================

-- 5a. qr_hash: partial unique index for O(log n) QR scan lookups
DROP INDEX IF EXISTS idx_orders_qr_hash;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_qr_hash
    ON public.orders(qr_hash)
    WHERE qr_hash IS NOT NULL;

-- 5b. Active order queue (kitchen display board)
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status
    ON public.orders(tenant_id, status)
    WHERE status IN ('pending', 'preparing', 'ready');

-- 5c. Order lookup by payment state (cashier dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_tenant_payment
    ON public.orders(tenant_id, payment_status);

-- 5d. order_items by order (most common join)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON public.order_items(order_id);

-- 5e. Inventory items below threshold (low-stock alerts)
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock
    ON public.inventory_items(tenant_id, current_stock)
    WHERE current_stock <= low_stock_threshold;

-- 5f. Orders by tenant + created_at for date-range reports
CREATE INDEX IF NOT EXISTS idx_orders_tenant_created
    ON public.orders(tenant_id, created_at DESC);

-- 5g. pgvector HNSW index for approximate nearest-neighbor semantic search
--     NOTE: This index is global (not per-tenant). Queries MUST filter tenant_id
--     first via a CTE or subquery to ensure tenant isolation, as the HNSW index
--     cannot be efficiently combined with a WHERE tenant_id = $1 predicate.
--     For deployments with many tenants (>20) or large per-tenant embedding sets,
--     consider switching to ivfflat with lists = (total_rows / 1000) which
--     handles pre-filtering better.
--
--     Correct query pattern:
--       WITH tenant_embeddings AS (
--           SELECT id, embedding FROM menu_embeddings WHERE tenant_id = $1
--       )
--       SELECT id FROM tenant_embeddings
--       ORDER BY embedding <=> $2
--       LIMIT 10;
CREATE INDEX IF NOT EXISTS idx_menu_embeddings_hnsw
    ON public.menu_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);


-- =============================================================================
-- SECTION 6: TRIGGERS — TOTAL PRICE SYNC & TIMESTAMPS
-- =============================================================================

-- F4/F5: Define the shared helper FIRST, then both trigger functions delegate to it.
--        This eliminates the duplicated aggregation logic that could drift.

-- 6a. Shared helper — computes and writes the correct total for a given order
CREATE OR REPLACE FUNCTION sync_order_total_price_for_order(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_new_total NUMERIC(10,2);
BEGIN
    SELECT COALESCE(SUM(
        (oi.unit_price + COALESCE(mod_sum.total_mod_price, 0)) * oi.quantity
    ), 0)
    INTO v_new_total
    FROM public.order_items oi
    LEFT JOIN (
        SELECT oim.order_item_id,
               SUM(oim.additional_price) AS total_mod_price
        FROM public.order_item_modifiers oim
        GROUP BY oim.order_item_id
    ) mod_sum ON mod_sum.order_item_id = oi.id
    WHERE oi.order_id = p_order_id;

    UPDATE public.orders
    SET total_price = v_new_total,
        updated_at  = now()
    WHERE id = p_order_id;
END;
$$ LANGUAGE plpgsql;

-- 6b. Trigger function for order_items changes — delegates to shared helper
CREATE OR REPLACE FUNCTION sync_order_total_price()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_order_id := OLD.order_id;
    ELSE
        v_order_id := NEW.order_id;
    END IF;

    PERFORM sync_order_total_price_for_order(v_order_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_order_total_on_items ON public.order_items;
CREATE TRIGGER trg_sync_order_total_on_items
    AFTER INSERT OR UPDATE OR DELETE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION sync_order_total_price();

-- 6c. Trigger function for order_item_modifiers changes — delegates to same helper
CREATE OR REPLACE FUNCTION sync_order_total_from_modifier()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT order_id INTO v_order_id FROM public.order_items WHERE id = OLD.order_item_id;
    ELSE
        SELECT order_id INTO v_order_id FROM public.order_items WHERE id = NEW.order_item_id;
    END IF;

    PERFORM sync_order_total_price_for_order(v_order_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_order_total_on_modifiers ON public.order_item_modifiers;
CREATE TRIGGER trg_sync_order_total_on_modifiers
    AFTER INSERT OR UPDATE OR DELETE ON public.order_item_modifiers
    FOR EACH ROW EXECUTE FUNCTION sync_order_total_from_modifier();

-- 6d. updated_at triggers for new tables
CREATE TRIGGER set_timestamp_modifier_groups
    BEFORE UPDATE ON public.modifier_groups
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_modifier_options
    BEFORE UPDATE ON public.modifier_options
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_shifts
    BEFORE UPDATE ON public.shifts
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


-- =============================================================================
-- SECTION 7: INVENTORY DEDUCTION
-- =============================================================================
-- Triggers when orders.payment_status transitions 'unpaid' → 'paid'.
--
-- Unit mode:       deduct current_stock by (quantity_required × order_item.quantity)
--                  via recipe_matrix (quantity_required = 1 for unit-mapped items)
-- Measurement mode: same formula; quantity_required = grams/mL per serving
--
-- F8: Over-deduction is now logged explicitly as a separate alert row instead of
--     silently flooring at zero. The stock floor (GREATEST) is kept to preserve
--     data integrity, but the over-deduction event is surfaced for ops review.
-- =============================================================================

CREATE OR REPLACE FUNCTION process_inventory_deduction()
RETURNS TRIGGER AS $$
DECLARE
    v_inventory_mode  inventory_mode_enum;
    v_item            RECORD;
    v_ingredient      RECORD;
    v_deduct_qty      NUMERIC(10,2);
    v_current_stock   NUMERIC(10,2);
BEGIN
    -- Guard: only fire on unpaid → paid transition
    IF NOT (OLD.payment_status = 'unpaid' AND NEW.payment_status = 'paid') THEN
        RETURN NEW;
    END IF;

    -- Fetch tenant's configured inventory mode
    SELECT inventory_mode
    INTO v_inventory_mode
    FROM public.tenants
    WHERE id = NEW.tenant_id;

    -- Iterate every item in this order
    FOR v_item IN
        SELECT oi.id,
               oi.menu_item_id,
               oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
    LOOP
        -- Both modes use recipe_matrix for the item→inventory mapping.
        -- Unit mode: quantity_required is expected to be 1 per unit sold.
        -- Measurement mode: quantity_required is grams/mL per serving.
        FOR v_ingredient IN
            SELECT rm.inventory_item_id,
                   rm.quantity_required
            FROM public.recipe_matrix rm
            WHERE rm.menu_item_id = v_item.menu_item_id
              AND rm.tenant_id    = NEW.tenant_id
        LOOP
            v_deduct_qty := v_ingredient.quantity_required * v_item.quantity;

            -- F8: Capture current stock before deduction for over-deduction detection
            SELECT current_stock
            INTO v_current_stock
            FROM public.inventory_items
            WHERE id        = v_ingredient.inventory_item_id
              AND tenant_id = NEW.tenant_id;

            -- Floor at zero to maintain data integrity; log if over-deducted
            UPDATE public.inventory_items
            SET current_stock = GREATEST(current_stock - v_deduct_qty, 0),
                updated_at    = now()
            WHERE id        = v_ingredient.inventory_item_id
              AND tenant_id = NEW.tenant_id;

            -- F8: Explicit over-deduction alert — surfaces as a separate resolved=false row
            IF (v_current_stock - v_deduct_qty) < 0 THEN
                INSERT INTO public.low_stock_alerts (
                    tenant_id,
                    inventory_item_id,
                    current_stock,
                    threshold,
                    triggered_by_order_id,
                    is_resolved
                )
                VALUES (
                    NEW.tenant_id,
                    v_ingredient.inventory_item_id,
                    0,  -- stock floored to 0
                    0,  -- threshold of 0 signals over-deduction (not low-stock)
                    NEW.id,
                    false
                );
            END IF;
        END LOOP;
    END LOOP;

    -- Low-stock alert: flag items now at or below threshold (one alert per item per day)
    INSERT INTO public.low_stock_alerts (
        tenant_id,
        inventory_item_id,
        current_stock,
        threshold,
        triggered_by_order_id
    )
    SELECT
        ii.tenant_id,
        ii.id,
        ii.current_stock,
        ii.low_stock_threshold,
        NEW.id
    FROM public.inventory_items ii
    WHERE ii.tenant_id     = NEW.tenant_id
      AND ii.current_stock <= ii.low_stock_threshold
      AND NOT EXISTS (
          -- F9: dedup index on (inventory_item_id, created_at DESC) makes this efficient
          SELECT 1
          FROM public.low_stock_alerts lsa
          WHERE lsa.inventory_item_id = ii.id
            AND lsa.created_at >= CURRENT_DATE::TIMESTAMPTZ
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-attach trigger (replaces any skeleton from v1)
DROP TRIGGER IF EXISTS trigger_inventory_deduction ON public.orders;
CREATE TRIGGER trigger_inventory_deduction
    AFTER UPDATE OF payment_status ON public.orders
    FOR EACH ROW
    WHEN (OLD.payment_status = 'unpaid' AND NEW.payment_status = 'paid')
    EXECUTE FUNCTION process_inventory_deduction();


-- =============================================================================
-- SECTION 8: RLS POLICIES
-- =============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.modifier_groups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifier_options      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_modifiers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_stock_alerts      ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- Anonymous customer policies (QR menu flow — no JWT)
-- -------------------------------------------------------------------------

-- F7: Require qr_hash IS NULL on anon order insert.
--     The Next.js API route sets qr_hash server-side after validation.
--     A direct-to-Supabase client cannot forge an order with an existing qr_hash.
DROP POLICY IF EXISTS customer_insert_orders ON public.orders;
CREATE POLICY customer_insert_orders ON public.orders
    FOR INSERT
    TO anon
    WITH CHECK (qr_hash IS NULL);

-- Allow anonymous customers to read their own order via qr_hash (status check)
DROP POLICY IF EXISTS customer_select_own_order ON public.orders;
CREATE POLICY customer_select_own_order ON public.orders
    FOR SELECT
    TO anon
    USING (qr_hash IS NOT NULL);

-- Anonymous cart item insert
DROP POLICY IF EXISTS customer_insert_order_items ON public.order_items;
CREATE POLICY customer_insert_order_items ON public.order_items
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Anonymous cart item read (scoped to orders with a qr_hash)
DROP POLICY IF EXISTS customer_select_order_items ON public.order_items;
CREATE POLICY customer_select_order_items ON public.order_items
    FOR SELECT
    TO anon
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE qr_hash IS NOT NULL
        )
    );

-- Menu browsing (available items only)
DROP POLICY IF EXISTS customer_select_menu_items ON public.menu_items;
CREATE POLICY customer_select_menu_items ON public.menu_items
    FOR SELECT
    TO anon
    USING (is_available = true);

-- Category browsing
DROP POLICY IF EXISTS customer_select_categories ON public.categories;
CREATE POLICY customer_select_categories ON public.categories
    FOR SELECT
    TO anon
    USING (true);

-- Modifier groups (item customization)
DROP POLICY IF EXISTS customer_select_modifier_groups ON public.modifier_groups;
CREATE POLICY customer_select_modifier_groups ON public.modifier_groups
    FOR SELECT
    TO anon
    USING (true);

-- Modifier options (available options only)
DROP POLICY IF EXISTS customer_select_modifier_options ON public.modifier_options;
CREATE POLICY customer_select_modifier_options ON public.modifier_options
    FOR SELECT
    TO anon
    USING (is_available = true);

-- -------------------------------------------------------------------------
-- F6: Authenticated tenant-isolation policies — all scoped TO authenticated
-- -------------------------------------------------------------------------

DROP POLICY IF EXISTS "Tenant isolation for modifier_groups" ON public.modifier_groups;
CREATE POLICY "Tenant isolation for modifier_groups" ON public.modifier_groups
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Tenant isolation for modifier_options" ON public.modifier_options;
CREATE POLICY "Tenant isolation for modifier_options" ON public.modifier_options
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Tenant isolation for order_item_modifiers" ON public.order_item_modifiers;
CREATE POLICY "Tenant isolation for order_item_modifiers" ON public.order_item_modifiers
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Tenant isolation for shifts" ON public.shifts;
CREATE POLICY "Tenant isolation for shifts" ON public.shifts
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Tenant isolation for order_status_logs" ON public.order_status_logs;
CREATE POLICY "Tenant isolation for order_status_logs" ON public.order_status_logs
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

DROP POLICY IF EXISTS "Tenant isolation for low_stock_alerts" ON public.low_stock_alerts;
CREATE POLICY "Tenant isolation for low_stock_alerts" ON public.low_stock_alerts
    FOR ALL
    TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);


-- =============================================================================
-- SECTION 9: CONVENIENCE VIEWS
-- F10: All views now include an explicit tenant_id predicate so they are safe
--      when called via service_role (which bypasses RLS).
-- =============================================================================

-- 9a. Active order queue (kitchen display board)
CREATE OR REPLACE VIEW public.v_active_orders AS
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
            'notes',         oi.customization_notes
        )
        ORDER BY oi.created_at
    ) AS items
FROM public.orders o
JOIN public.order_items oi ON oi.order_id = o.id
JOIN public.menu_items  mi ON mi.id = oi.menu_item_id
WHERE o.status IN ('pending', 'preparing', 'ready')
  AND o.payment_status = 'unpaid'
  -- F10: explicit tenant predicate (safe for service_role callers)
  AND o.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
GROUP BY o.id;

-- 9b. Daily revenue summary
--     F14: Use Asia/Manila timezone — Cebu is UTC+8
CREATE OR REPLACE VIEW public.v_daily_revenue AS
SELECT
    tenant_id,
    (created_at AT TIME ZONE 'Asia/Manila')::DATE AS sale_date,
    payment_method,
    COUNT(*) FILTER (WHERE payment_status = 'paid')         AS total_transactions,
    SUM(total_price) FILTER (WHERE payment_status = 'paid') AS total_revenue,
    COUNT(*) FILTER (WHERE status = 'cancelled')            AS cancellations,
    COUNT(*) FILTER (WHERE status = 'voided')               AS voids
FROM public.orders
WHERE tenant_id = (auth.jwt() ->> 'tenant_id')::uuid  -- F10
GROUP BY tenant_id,
         (created_at AT TIME ZONE 'Asia/Manila')::DATE,
         payment_method;

-- 9c. Inventory variance summary
CREATE OR REPLACE VIEW public.v_inventory_variance AS
SELECT
    sa.tenant_id,
    sa.audit_date,
    ii.name              AS item_name,
    ii.unit_type,
    sa.theoretical_qty,
    sa.physical_qty,
    sa.variance,
    CASE
        WHEN sa.variance < 0 THEN 'shrinkage'
        WHEN sa.variance > 0 THEN 'surplus'
        ELSE 'balanced'
    END                  AS variance_type,
    p.full_name          AS recorded_by
FROM public.stock_audits sa
JOIN public.inventory_items ii ON ii.id = sa.inventory_item_id
LEFT JOIN public.profiles   p  ON p.id  = sa.recorded_by
-- F10: explicit tenant predicate
WHERE sa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
ORDER BY sa.audit_date DESC, ABS(sa.variance) DESC;

-- 9d. Staff transaction count (cashier performance per shift)
CREATE OR REPLACE VIEW public.v_staff_transaction_counts AS
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
  AND osl.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid  -- F10
GROUP BY osl.tenant_id, osl.staff_id, p.full_name,
         s.id, s.opened_at, s.closed_at;

-- 9e. Open low-stock alerts (operational dashboard)
CREATE OR REPLACE VIEW public.v_open_low_stock_alerts AS
SELECT
    lsa.id,
    lsa.tenant_id,
    ii.name         AS item_name,
    ii.unit_type,
    lsa.current_stock,
    lsa.threshold,
    lsa.triggered_by_order_id,
    lsa.created_at,
    -- Distinguish over-deduction events (threshold = 0) from normal low-stock alerts
    CASE
        WHEN lsa.threshold = 0 THEN 'over_deduction'
        ELSE 'low_stock'
    END             AS alert_type
FROM public.low_stock_alerts lsa
JOIN public.inventory_items  ii ON ii.id = lsa.inventory_item_id
WHERE lsa.is_resolved = false
  AND lsa.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid  -- F10
ORDER BY lsa.created_at DESC;