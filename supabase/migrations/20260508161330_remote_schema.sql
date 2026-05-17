drop extension if exists "pg_net";

drop trigger if exists "set_timestamp_roles" on "public"."roles";

drop policy "Tenant isolation for roles" on "public"."roles";

revoke delete on table "public"."roles" from "anon";

revoke insert on table "public"."roles" from "anon";

revoke references on table "public"."roles" from "anon";

revoke select on table "public"."roles" from "anon";

revoke trigger on table "public"."roles" from "anon";

revoke truncate on table "public"."roles" from "anon";

revoke update on table "public"."roles" from "anon";

revoke delete on table "public"."roles" from "authenticated";

revoke insert on table "public"."roles" from "authenticated";

revoke references on table "public"."roles" from "authenticated";

revoke select on table "public"."roles" from "authenticated";

revoke trigger on table "public"."roles" from "authenticated";

revoke truncate on table "public"."roles" from "authenticated";

revoke update on table "public"."roles" from "authenticated";

revoke delete on table "public"."roles" from "service_role";

revoke insert on table "public"."roles" from "service_role";

revoke references on table "public"."roles" from "service_role";

revoke select on table "public"."roles" from "service_role";

revoke trigger on table "public"."roles" from "service_role";

revoke truncate on table "public"."roles" from "service_role";

revoke update on table "public"."roles" from "service_role";

alter table "public"."roles" drop constraint "roles_tenant_id_fkey";

alter table "public"."roles" drop constraint "roles_pkey";

drop index if exists "public"."idx_roles_tenant_id";

drop index if exists "public"."roles_pkey";

drop table "public"."roles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_order_item_modifier_tenant_consistency()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.check_order_item_tenant_consistency()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.log_order_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_modifier_price_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.additional_price IS DISTINCT FROM OLD.additional_price THEN
        RAISE EXCEPTION
            'order_item_modifiers.additional_price is immutable after insert (id: %)', OLD.id;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_shift_reopen()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF OLD.status = 'closed' AND NEW.status = 'open' THEN
        RAISE EXCEPTION
            'Shift % is closed and cannot be re-opened. Create a new shift instead.', OLD.id;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.prevent_unit_price_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.unit_price IS DISTINCT FROM OLD.unit_price THEN
        RAISE EXCEPTION
            'order_items.unit_price is immutable after insert (order_item_id: %)', OLD.id;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.process_inventory_deduction()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.promote_user_role(p_user_id uuid, p_new_role public.profile_role_enum)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.reorder_categories(ordered_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.sync_order_total_from_modifier()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.sync_order_total_price()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_order_id UUID;
BEGIN
    v_order_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.order_id ELSE NEW.order_id END;
    PERFORM sync_order_total_price_for_order(v_order_id);
    RETURN COALESCE(NEW, OLD);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_order_total_price_for_order(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

drop policy "Allow service_role read to verification-docs" on "storage"."objects";

drop policy "Allow service_role update to verification-docs" on "storage"."objects";

drop policy "Allow service_role uploads to verification-docs" on "storage"."objects";


