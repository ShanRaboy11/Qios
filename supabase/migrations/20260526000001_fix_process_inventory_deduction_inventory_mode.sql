CREATE OR REPLACE FUNCTION public.process_inventory_deduction()
RETURNS TRIGGER AS $$
DECLARE
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
                    v_current_stock,
                    NEW.id,
                    false
                );
            END IF;
        END LOOP;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;