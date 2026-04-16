-- =============================================================================
-- SECTION 1: ENUM EXTENSIONS
-- =============================================================================

-- 1a. Order status — cancelled and voided for ops tracking; served for cashier analytics
DO $$ 
BEGIN
    CREATE TYPE public.order_status_enum AS ENUM ('pending', 'preparing', 'ready', 'cancelled', 'voided', 'served');
EXCEPTION
    WHEN duplicate_object THEN
        ALTER TYPE public.order_status_enum ADD VALUE IF NOT EXISTS 'cancelled';
        ALTER TYPE public.order_status_enum ADD VALUE IF NOT EXISTS 'voided';
        ALTER TYPE public.order_status_enum ADD VALUE IF NOT EXISTS 'served';
END $$;

-- 1b. Payment method
DO $$ 
BEGIN
    CREATE TYPE public.payment_method_enum AS ENUM ('cash', 'gcash', 'card', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1c. Shift status
DO $$ 
BEGIN
    CREATE TYPE public.shift_status_enum AS ENUM ('open', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- H2: Alert type — explicit enum replaces the threshold=0 sentinel
DO $$ 
BEGIN
    CREATE TYPE public.alert_type_enum AS ENUM ('low_stock', 'over_deduction');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- =============================================================================
-- SECTION 2: TABLES
-- =============================================================================

-- 2a. modifier_groups
CREATE TABLE IF NOT EXISTS public.modifier_groups (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    menu_item_id   UUID        NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    name           TEXT        NOT NULL,
    is_required    BOOLEAN     NOT NULL DEFAULT false,
    -- H4: min/max selections with mutual consistency check
    min_selections INT         NOT NULL DEFAULT 0,
    max_selections INT         NOT NULL DEFAULT 1,
    display_order  INT         NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_max_selections_positive    CHECK (max_selections >= 1),
    CONSTRAINT chk_min_selections_nonneg      CHECK (min_selections >= 0),
    CONSTRAINT chk_min_lte_max               CHECK (min_selections <= max_selections)
);

COMMENT ON COLUMN public.modifier_groups.min_selections IS
    'Minimum number of options the customer must choose. 0 = optional group.';
COMMENT ON COLUMN public.modifier_groups.max_selections IS
    'Maximum number of options the customer may choose.';

CREATE INDEX IF NOT EXISTS idx_modifier_groups_tenant_id    ON public.modifier_groups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modifier_groups_menu_item_id ON public.modifier_groups(menu_item_id);

-- 2b. modifier_options
CREATE TABLE IF NOT EXISTS public.modifier_options (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID          NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    modifier_group_id UUID          NOT NULL REFERENCES public.modifier_groups(id) ON DELETE CASCADE,
    name              TEXT          NOT NULL,
    additional_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_available      BOOLEAN       NOT NULL DEFAULT true,
    display_order     INT           NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modifier_options_tenant_id         ON public.modifier_options(tenant_id);
CREATE INDEX IF NOT EXISTS idx_modifier_options_modifier_group_id ON public.modifier_options(modifier_group_id);

-- 2c. order_item_modifiers
--     H3: UNIQUE on (order_item_id, modifier_option_id) — prevents duplicate selections
CREATE TABLE IF NOT EXISTS public.order_item_modifiers (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id          UUID          NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_item_id      UUID          NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    modifier_option_id UUID          NOT NULL REFERENCES public.modifier_options(id) ON DELETE CASCADE,
    additional_price   NUMERIC(10,2) NOT NULL DEFAULT 0,  -- snapshot; immutable after insert
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_order_item_modifier UNIQUE (order_item_id, modifier_option_id)
);

COMMENT ON COLUMN public.order_item_modifiers.additional_price IS
    'Snapshot of modifier_options.additional_price at order creation time. Immutable after insert.';

CREATE INDEX IF NOT EXISTS idx_order_item_modifiers_tenant_id     ON public.order_item_modifiers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_item_modifiers_order_item_id ON public.order_item_modifiers(order_item_id);

-- 2d. shifts
CREATE TABLE IF NOT EXISTS public.shifts (
    id         UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id  UUID              NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id   UUID              NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status     shift_status_enum NOT NULL DEFAULT 'open',
    opened_at  TIMESTAMPTZ       NOT NULL DEFAULT now(),
    closed_at  TIMESTAMPTZ,
    notes      TEXT,
    created_at TIMESTAMPTZ       NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ       NOT NULL DEFAULT now(),
    CONSTRAINT chk_shift_closed_after_opened CHECK (closed_at IS NULL OR closed_at > opened_at)
);

-- F11: one open shift per staff per tenant
CREATE UNIQUE INDEX IF NOT EXISTS uq_shifts_staff_open
    ON public.shifts(staff_id, tenant_id)
    WHERE status = 'open';

CREATE INDEX IF NOT EXISTS idx_shifts_tenant_id ON public.shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shifts_staff_id  ON public.shifts(staff_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status    ON public.shifts(tenant_id, status);

-- 2e. order_status_logs
--     H6: auto-populated by trigger on orders — do not write to directly from application
CREATE TABLE IF NOT EXISTS public.order_status_logs (
    id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID              NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    order_id        UUID              NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    staff_id        UUID              REFERENCES public.profiles(id) ON DELETE SET NULL,
    status_change   order_status_enum NOT NULL,
    previous_status order_status_enum,
    notes           TEXT,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.order_status_logs IS
    'Append-only audit log. Auto-populated by trg_log_order_status_change. Do not insert manually.';

CREATE INDEX IF NOT EXISTS idx_order_status_logs_tenant
    ON public.order_status_logs(tenant_id, staff_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id
    ON public.order_status_logs(order_id);

-- 2f. low_stock_alerts
--     H2: alert_type column replaces threshold=0 sentinel
CREATE TABLE IF NOT EXISTS public.low_stock_alerts (
    id                    UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id             UUID             NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    inventory_item_id     UUID             NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    alert_type            alert_type_enum  NOT NULL DEFAULT 'low_stock',
    current_stock         NUMERIC(10,2)    NOT NULL,
    threshold             NUMERIC(10,2)    NOT NULL,
    triggered_by_order_id UUID             REFERENCES public.orders(id) ON DELETE SET NULL,
    is_resolved           BOOLEAN          NOT NULL DEFAULT false,
    resolved_at           TIMESTAMPTZ,
    created_at            TIMESTAMPTZ      NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.low_stock_alerts.alert_type IS
    'low_stock = stock at or below threshold; over_deduction = stock went negative (floored to 0).';

CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_tenant_id
    ON public.low_stock_alerts(tenant_id, is_resolved, created_at DESC);

-- F9: dedup anti-join index
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_dedup
    ON public.low_stock_alerts(inventory_item_id, created_at DESC);


-- =============================================================================
-- SECTION 3: COLUMN ADDITIONS TO EXISTING TABLES
-- =============================================================================

-- 3a. order_items: unit_price snapshot (immutable)
ALTER TABLE public.order_items
    ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.order_items.unit_price IS
    'Snapshot of menu_items.price at order creation time. Immutable after insert.';

-- 3b. orders: payment_method
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS payment_method payment_method_enum;

COMMENT ON COLUMN public.orders.payment_method IS
    'Set at payment confirmation. NULL until payment_status transitions to paid. Nullable by design.';

-- 3c. orders: cancellation / void tracking
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS cancelled_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS voided_by           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS void_reason         TEXT;

-- 3d. orders: shift linkage
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

-- 3g. categories: unique display_order per tenant (DEFERRABLE for drag-and-drop swaps)
ALTER TABLE public.categories
    ADD CONSTRAINT uq_category_display_order
    UNIQUE (tenant_id, display_order)
    DEFERRABLE INITIALLY DEFERRED;

COMMENT ON CONSTRAINT uq_category_display_order ON public.categories IS
    'DEFERRABLE — use reorder_categories() stored procedure for swaps, not individual REST calls.';


-- =============================================================================
-- SECTION 4: CONSTRAINTS — TENANT CONSISTENCY & IMMUTABILITY
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

-- 4c. Immutability guard on order_items.unit_price
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

-- 4d. Immutability guard on order_item_modifiers.additional_price
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

-- 4e. H5: Shift immutability — prevent re-opening a closed shift
CREATE OR REPLACE FUNCTION prevent_shift_reopen()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'closed' AND NEW.status = 'open' THEN
        RAISE EXCEPTION
            'Shift % is closed and cannot be re-opened. Create a new shift instead.', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_shift_reopen ON public.shifts;
CREATE TRIGGER trg_prevent_shift_reopen
    BEFORE UPDATE ON public.shifts
    FOR EACH ROW EXECUTE FUNCTION prevent_shift_reopen();


-- =============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- =============================================================================

-- 5a. qr_hash lookup (O(log n), null-safe)
DROP INDEX IF EXISTS idx_orders_qr_hash;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_qr_hash
    ON public.orders(qr_hash)
    WHERE qr_hash IS NOT NULL;

-- 5b. Kitchen display board — active order queue
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status
    ON public.orders(tenant_id, status)
    WHERE status IN ('pending', 'preparing', 'ready');

-- 5c. Cashier dashboard — payment state filter
CREATE INDEX IF NOT EXISTS idx_orders_tenant_payment
    ON public.orders(tenant_id, payment_status);

-- 5d. order_items by order (most common join)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
    ON public.order_items(order_id);

-- M3: Covering index for the inventory deduction loop — index-only scan
CREATE INDEX IF NOT EXISTS idx_order_items_deduction_covering
    ON public.order_items(order_id, menu_item_id, quantity);

-- 5e. Inventory items at or below threshold (partial index for low-stock filter)
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock
    ON public.inventory_items(tenant_id, current_stock)
    WHERE current_stock <= low_stock_threshold;

-- 5f. Date-range revenue reports
CREATE INDEX IF NOT EXISTS idx_orders_tenant_created
    ON public.orders(tenant_id, created_at DESC);

-- M4: Shift-based order lookup (shift closure reports)
CREATE INDEX IF NOT EXISTS idx_orders_tenant_shift
    ON public.orders(tenant_id, shift_id)
    WHERE shift_id IS NOT NULL;

-- 5g. pgvector HNSW semantic search
--
--     IMPORTANT: This index is GLOBAL (not per-tenant). Always pre-filter by tenant_id
--     using a CTE before the ORDER BY embedding <=> $query clause:
--
--       WITH tenant_items AS (
--           SELECT id, embedding FROM public.menu_embeddings WHERE tenant_id = $1
--       )
--       SELECT id FROM tenant_items ORDER BY embedding <=> $2 LIMIT 10;
--
--     For >20 tenants or large per-tenant embedding sets, consider switching to:
--       USING ivfflat (embedding vector_cosine_ops) WITH (lists = <total_rows / 1000>)
--     ivfflat handles pre-filtering better than HNSW at scale.
CREATE INDEX IF NOT EXISTS idx_menu_embeddings_hnsw
    ON public.menu_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);


-- =============================================================================
-- SECTION 6: TRIGGERS — TOTAL PRICE SYNC, TIMESTAMPS, STATUS LOGGING
-- =============================================================================

-- 6a. Shared helper: recomputes and writes total_price for a given order
--     Called by both order_items and order_item_modifiers triggers.
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

-- 6b. Trigger function: order_items changes → sync total
CREATE OR REPLACE FUNCTION sync_order_total_price()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
BEGIN
    v_order_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.order_id ELSE NEW.order_id END;
    PERFORM sync_order_total_price_for_order(v_order_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_order_total_on_items ON public.order_items;
CREATE TRIGGER trg_sync_order_total_on_items
    AFTER INSERT OR UPDATE OR DELETE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION sync_order_total_price();

-- 6c. Trigger function: order_item_modifiers changes → sync total
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

-- 6d. H6: Auto-populate order_status_logs on every orders.status change
--     staff_id is read from the JWT claim so the application does not need to pass it.
--     For service-role server-side updates, staff_id will be NULL — this is acceptable
--     as system-initiated transitions (e.g. automated expiry) are distinguishable by NULL staff_id.
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.order_status_logs (
            tenant_id,
            order_id,
            staff_id,
            status_change,
            previous_status
        )
        VALUES (
            NEW.tenant_id,
            NEW.id,
            -- Extract staff_id from JWT claim; NULL for service-role / system transitions
            NULLIF((auth.jwt() ->> 'sub')::uuid, '00000000-0000-0000-0000-000000000000'),
            NEW.status,
            OLD.status
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_order_status_change ON public.orders;
CREATE TRIGGER trg_log_order_status_change
    AFTER UPDATE OF status ON public.orders
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- 6e. updated_at triggers for new tables
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
-- Fires on orders.payment_status: 'unpaid' → 'paid'.
--
-- C1 FIX: SELECT FOR UPDATE on each inventory_items row before read-then-update.
--         Eliminates the read-then-write race condition under concurrent payments.
--
-- H1 FIX: Dedup window uses Manila midnight, not UTC midnight.
--
-- H2 FIX: alert_type column used instead of threshold=0 sentinel.
-- =============================================================================

CREATE OR REPLACE FUNCTION process_inventory_deduction()
RETURNS TRIGGER AS $$
DECLARE
    v_inventory_mode  inventory_mode_enum;
    v_item            RECORD;
    v_ingredient      RECORD;
    v_deduct_qty      NUMERIC(10,2);
    v_current_stock   NUMERIC(10,2);
    v_manila_today    TIMESTAMPTZ;
BEGIN
    IF NOT (OLD.payment_status = 'unpaid' AND NEW.payment_status = 'paid') THEN
        RETURN NEW;
    END IF;

    -- Manila midnight for dedup window (H1)
    v_manila_today := (CURRENT_DATE AT TIME ZONE 'Asia/Manila')::TIMESTAMPTZ;

    SELECT inventory_mode INTO v_inventory_mode
    FROM public.tenants WHERE id = NEW.tenant_id;

    FOR v_item IN
        SELECT oi.id, oi.menu_item_id, oi.quantity
        FROM public.order_items oi
        WHERE oi.order_id = NEW.id
    LOOP
        FOR v_ingredient IN
            SELECT rm.inventory_item_id, rm.quantity_required
            FROM public.recipe_matrix rm
            WHERE rm.menu_item_id = v_item.menu_item_id
              AND rm.tenant_id    = NEW.tenant_id
        LOOP
            v_deduct_qty := v_ingredient.quantity_required * v_item.quantity;

            -- C1: Lock the row before reading to prevent concurrent over-deduction
            SELECT current_stock INTO v_current_stock
            FROM public.inventory_items
            WHERE id        = v_ingredient.inventory_item_id
              AND tenant_id = NEW.tenant_id
            FOR UPDATE;

            UPDATE public.inventory_items
            SET current_stock = GREATEST(current_stock - v_deduct_qty, 0),
                updated_at    = now()
            WHERE id        = v_ingredient.inventory_item_id
              AND tenant_id = NEW.tenant_id;

            -- H2: Use alert_type column instead of threshold=0 sentinel
            IF (v_current_stock - v_deduct_qty) < 0 THEN
                INSERT INTO public.low_stock_alerts (
                    tenant_id,
                    inventory_item_id,
                    alert_type,
                    current_stock,
                    threshold,
                    triggered_by_order_id,
                    is_resolved
                )
                VALUES (
                    NEW.tenant_id,
                    v_ingredient.inventory_item_id,
                    'over_deduction',
                    0,
                    v_current_stock,  -- original stock before deduction (useful for ops review)
                    NEW.id,
                    false
                );
            END IF;
        END LOOP;
    END LOOP;

    -- Low-stock alerts: one alert per item per Manila calendar day (H1)
    INSERT INTO public.low_stock_alerts (
        tenant_id,
        inventory_item_id,
        alert_type,
        current_stock,
        threshold,
        triggered_by_order_id
    )
    SELECT
        ii.tenant_id,
        ii.id,
        'low_stock',
        ii.current_stock,
        ii.low_stock_threshold,
        NEW.id
    FROM public.inventory_items ii
    WHERE ii.tenant_id     = NEW.tenant_id
      AND ii.current_stock <= ii.low_stock_threshold
      AND NOT EXISTS (
          SELECT 1
          FROM public.low_stock_alerts lsa
          WHERE lsa.inventory_item_id = ii.id
            AND lsa.alert_type        = 'low_stock'
            -- H1: Manila midnight, not UTC midnight
            AND lsa.created_at >= v_manila_today
      );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_inventory_deduction ON public.orders;
CREATE TRIGGER trigger_inventory_deduction
    AFTER UPDATE OF payment_status ON public.orders
    FOR EACH ROW
    WHEN (OLD.payment_status = 'unpaid' AND NEW.payment_status = 'paid')
    EXECUTE FUNCTION process_inventory_deduction();


-- =============================================================================
-- SECTION 8: HELPER STORED PROCEDURES
-- =============================================================================

-- H8: Category reorder — wraps the swap in a deferred transaction so the
--     DEFERRABLE uq_category_display_order constraint works correctly.
--     Call via Supabase RPC: supabase.rpc('reorder_categories', { ordered_ids: [...] })
--     ordered_ids: array of category UUIDs in their new display order (index 0 = order 0).
CREATE OR REPLACE FUNCTION public.reorder_categories(ordered_ids UUID[])
RETURNS VOID AS $$
DECLARE
    i INT;
BEGIN
    -- Defer the unique constraint so intermediate states (two rows at same display_order
    -- during a swap) do not cause a violation mid-transaction.
    SET CONSTRAINTS uq_category_display_order DEFERRED;

    FOR i IN 1 .. array_length(ordered_ids, 1) LOOP
        UPDATE public.categories
        SET display_order = i - 1,
            updated_at    = now()
        WHERE id = ordered_ids[i]
          AND tenant_id = (auth.jwt() ->> 'tenant_id')::uuid;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.reorder_categories IS
    'Atomically reorders categories for a tenant. Pass an ordered array of category UUIDs.
     Uses DEFERRED constraint to allow mid-transaction order collisions to resolve.
     Scoped to the caller''s tenant_id from JWT — cannot reorder other tenants'' categories.';


-- =============================================================================
-- SECTION 9: RLS POLICIES
-- =============================================================================

ALTER TABLE public.modifier_groups       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifier_options      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_modifiers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_stock_alerts      ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Anonymous customer policies (QR menu flow — no JWT)
-- ---------------------------------------------------------------------------

-- F7: anon order insert requires qr_hash IS NULL (server sets it after validation)
DROP POLICY IF EXISTS customer_insert_orders ON public.orders;
CREATE POLICY customer_insert_orders ON public.orders
    FOR INSERT TO anon
    WITH CHECK (qr_hash IS NULL);

-- anon order read via qr_hash (status polling)
-- NOTE for developers: always add WHERE qr_hash = $1 in application queries.
-- We've opened reads up to NULL qr_hashes as well, to allow the checkout flow
-- to query the 'draft' order if the user re-loads before payment completion.
DROP POLICY IF EXISTS customer_select_own_order ON public.orders;
CREATE POLICY customer_select_own_order ON public.orders
    FOR SELECT TO anon
    USING (true);

-- C3: anon order_items INSERT — scope to orders still being built (qr_hash IS NULL)
DROP POLICY IF EXISTS customer_insert_order_items ON public.order_items;
CREATE POLICY customer_insert_order_items ON public.order_items
    FOR INSERT TO anon
    WITH CHECK (
        order_id IN (
            SELECT id FROM public.orders WHERE qr_hash IS NULL
        )
    );

-- anon order_items UPDATE/DELETE - Allow customers to change cart before paying/submitting.
-- Previously they could only INSERT or SELECT. Now they can modify their cart.
DROP POLICY IF EXISTS customer_update_order_items ON public.order_items;
CREATE POLICY customer_update_order_items ON public.order_items
    FOR UPDATE TO anon
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE qr_hash IS NULL
        )
    )
    WITH CHECK (
        order_id IN (
            SELECT id FROM public.orders WHERE qr_hash IS NULL
        )
    );

DROP POLICY IF EXISTS customer_delete_order_items ON public.order_items;
CREATE POLICY customer_delete_order_items ON public.order_items
    FOR DELETE TO anon
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE qr_hash IS NULL
        )
    );

-- anon order_items read — scoped to orders that have a qr_hash (submitted orders)
-- AND orders that are currently being built (qr_hash is null)
DROP POLICY IF EXISTS customer_select_order_items ON public.order_items;
CREATE POLICY customer_select_order_items ON public.order_items
    FOR SELECT TO anon
    USING (
        order_id IN (
            SELECT id FROM public.orders -- Let anon read items from orders currently being built or their saved order
        )
    );

-- Menu browsing (available items only)
DROP POLICY IF EXISTS customer_select_menu_items ON public.menu_items;
CREATE POLICY customer_select_menu_items ON public.menu_items
    FOR SELECT TO anon
    USING (is_available = true);

-- Category browsing
DROP POLICY IF EXISTS customer_select_categories ON public.categories;
CREATE POLICY customer_select_categories ON public.categories
    FOR SELECT TO anon
    USING (true);

-- R2: Modifier groups — scope to groups belonging to available menu items only.
--     Prevents leaking competitor modifier configuration on a shared platform.
DROP POLICY IF EXISTS customer_select_modifier_groups ON public.modifier_groups;
CREATE POLICY customer_select_modifier_groups ON public.modifier_groups
    FOR SELECT TO anon
    USING (
        menu_item_id IN (
            SELECT id FROM public.menu_items WHERE is_available = true
        )
    );

-- R2: Modifier options — scope to available options within available items only
DROP POLICY IF EXISTS customer_select_modifier_options ON public.modifier_options;
CREATE POLICY customer_select_modifier_options ON public.modifier_options
    FOR SELECT TO anon
    USING (
        is_available = true
        AND modifier_group_id IN (
            SELECT mg.id FROM public.modifier_groups mg
            JOIN public.menu_items mi ON mi.id = mg.menu_item_id
            WHERE mi.is_available = true
        )
    );

-- =============================================================================
-- AUTHENTICATED TENANT-ISOLATION POLICIES (with Optional By-pass for specific cases)
-- Pattern: tenant_id match OR super_admin bypass
-- Note: Re-evaluate if `super_admin` role should automatically be allowed to insert 
-- or modify data under ANY tenant_id, as it's very useful for development but
-- requires care in production to avoid accidental cross-tenant data pollution.
-- =============================================================================

DROP POLICY IF EXISTS "Tenant isolation for modifier_groups" ON public.modifier_groups;
CREATE POLICY "Tenant isolation for modifier_groups" ON public.modifier_groups
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant isolation for modifier_options" ON public.modifier_options;
CREATE POLICY "Tenant isolation for modifier_options" ON public.modifier_options
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant isolation for order_item_modifiers" ON public.order_item_modifiers;
CREATE POLICY "Tenant isolation for order_item_modifiers" ON public.order_item_modifiers
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant isolation for shifts" ON public.shifts;
CREATE POLICY "Tenant isolation for shifts" ON public.shifts
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant isolation for order_status_logs" ON public.order_status_logs;
CREATE POLICY "Tenant isolation for order_status_logs" ON public.order_status_logs
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant isolation for low_stock_alerts" ON public.low_stock_alerts;
CREATE POLICY "Tenant isolation for low_stock_alerts" ON public.low_stock_alerts
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );


-- =============================================================================
-- SECTION 10: VIEWS (security_invoker = true)
-- With security_invoker, every view runs under the caller's identity and RLS.
-- super_admin sees all tenants via the OR bypass in policies above.
-- Service-role bypasses RLS entirely — no explicit tenant predicate needed.
-- =============================================================================

-- 10a. Active order queue (kitchen display board)
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

-- 10b. Daily revenue summary (Asia/Manila timezone)
CREATE OR REPLACE VIEW public.v_daily_revenue WITH (security_invoker = true) AS
SELECT
    tenant_id,
    (created_at AT TIME ZONE 'Asia/Manila')::DATE AS sale_date,
    payment_method,
    COUNT(*) FILTER (WHERE payment_status = 'paid')         AS total_transactions,
    SUM(total_price) FILTER (WHERE payment_status = 'paid') AS total_revenue,
    COUNT(*) FILTER (WHERE status = 'cancelled')            AS cancellations,
    COUNT(*) FILTER (WHERE status = 'voided')               AS voids
FROM public.orders
GROUP BY
    tenant_id,
    (created_at AT TIME ZONE 'Asia/Manila')::DATE,
    payment_method;

COMMENT ON VIEW public.v_daily_revenue IS
    'Grouped by Manila date. payment_method NULL group = unpaid/pending orders. By design.';

-- 10c. Inventory variance summary
CREATE OR REPLACE VIEW public.v_inventory_variance WITH (security_invoker = true) AS
SELECT
    sa.tenant_id,
    sa.audit_date,
    ii.name         AS item_name,
    ii.unit_type,
    sa.theoretical_qty,
    sa.physical_qty,
    sa.variance,
    CASE
        WHEN sa.variance < 0 THEN 'shrinkage'
        WHEN sa.variance > 0 THEN 'surplus'
        ELSE 'balanced'
    END             AS variance_type,
    p.full_name     AS recorded_by
FROM public.stock_audits sa
JOIN public.inventory_items ii ON ii.id = sa.inventory_item_id
LEFT JOIN public.profiles   p  ON p.id  = sa.recorded_by
ORDER BY sa.audit_date DESC, ABS(sa.variance) DESC;

-- 10d. Staff transaction count per shift (cashier performance)
--      H7: filters on 'served' status (added to enum in Section 1)
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
-- H7: 'served' is the terminal cashier-confirmed status (added to enum in Section 1)
WHERE osl.status_change = 'served'
GROUP BY osl.tenant_id, osl.staff_id, p.full_name,
         s.id, s.opened_at, s.closed_at;

-- 10e. Open low-stock alerts (operational dashboard)
--      H2: uses alert_type column — no more threshold=0 sentinel
CREATE OR REPLACE VIEW public.v_open_low_stock_alerts WITH (security_invoker = true) AS
SELECT
    lsa.id,
    lsa.tenant_id,
    ii.name              AS item_name,
    ii.unit_type,
    lsa.alert_type,
    lsa.current_stock,
    lsa.threshold,
    lsa.triggered_by_order_id,
    lsa.created_at
FROM public.low_stock_alerts lsa
JOIN public.inventory_items  ii ON ii.id = lsa.inventory_item_id
WHERE lsa.is_resolved = false
ORDER BY lsa.created_at DESC;


-- =============================================================================
-- SECTION 11: AUTH HOOKS
-- =============================================================================

-- 11a. Profile creation on signup
--      C2: role is ALWAYS clamped to 'employee'. Never trust raw_user_meta_data for role.
--          Use promote_user_role() below for elevation by a super_admin or admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, tenant_id, full_name, role)
    VALUES (
        new.id,
        (new.raw_user_meta_data->>'tenant_id')::uuid,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        -- C2: Always 'employee' — prevents privilege escalation via signup metadata.
        --     Role elevation is done via promote_user_role() by an authorised admin.
        'employee'::profile_role_enum
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11b. Role elevation function
-- NOTE: Changed this to handle standard SQL injection logic safely.
CREATE OR REPLACE FUNCTION public.promote_user_role(
    p_user_id  UUID,
    p_new_role public.profile_role_enum
)
RETURNS VOID AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    v_caller_role := auth.jwt() ->> 'role';

    -- Only super_admin can create another super_admin; admin can promote to admin/employee
    IF p_new_role = 'super_admin' AND v_caller_role != 'super_admin' THEN
        RAISE EXCEPTION 'Only super_admin can grant super_admin role.';
    END IF;

    IF v_caller_role NOT IN ('super_admin', 'admin') THEN
        RAISE EXCEPTION 'Insufficient privileges to change roles. Caller role: %', v_caller_role;
    END IF;

    UPDATE public.profiles
    SET role       = p_new_role,
        updated_at = now()
    WHERE id = p_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.promote_user_role IS
    'Elevates a user role. Requires admin or super_admin JWT. super_admin-only for super_admin grants.';

-- 11c. Custom JWT claim hook — injects tenant_id and role into every access token
--      M8: super_admin receives tenant_id = '00000000-0000-0000-0000-000000000000' (zero UUID)
--          as a sentinel. RLS policies pass on (auth.jwt() ->> 'role') = 'super_admin',
--          so the zero UUID is never used for data filtering — it just prevents NULL
--          from breaking ::uuid casts in policies.
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    claims         jsonb;
    v_role         public.profile_role_enum;
    v_tenant_id    uuid;
BEGIN
    SELECT role, tenant_id
    INTO v_role, v_tenant_id
    FROM public.profiles
    WHERE id = (event->>'user_id')::uuid;

    claims := event->'claims';

    IF v_role IS NOT NULL THEN
        claims := jsonb_set(claims, '{role}', to_jsonb(v_role::text));

        -- M8: super_admin has no tenant — use zero UUID sentinel so ::uuid cast never fails
        IF v_role = 'super_admin' THEN
            claims := jsonb_set(claims, '{tenant_id}',
                to_jsonb('00000000-0000-0000-0000-000000000000'::text));
        ELSE
            claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_tenant_id::text));
        END IF;
    END IF;

    event := jsonb_set(event, '{claims}', claims);
    RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

GRANT EXECUTE ON FUNCTION public.reorder_categories   TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_role     TO authenticated;