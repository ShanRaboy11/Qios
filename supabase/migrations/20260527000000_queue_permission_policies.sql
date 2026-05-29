-- Restrict queue reads to employees with queue-related permissions.
-- Customers still use the existing anon policies for order creation / polling.

CREATE OR REPLACE FUNCTION public.can_access_order_queue()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    LEFT JOIN public.roles r
      ON r.id = p.app_role_id
     AND r.tenant_id = p.tenant_id
    WHERE p.id = auth.uid()
      AND (
        p.role = 'super_admin'
        OR (
          p.role = 'employee'
          AND p.tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
          AND (
            COALESCE((r.permissions -> 'orders' ->> 'Order Retrieval')::boolean, false)
            OR COALESCE((r.permissions -> 'orders' ->> 'Order Queue Management')::boolean, false)
            OR COALESCE((r.permissions -> 'orders' ->> 'Order Status Updating')::boolean, false)
          )
        )
      )
  );
$$;

DROP POLICY IF EXISTS "Tenant queue read access" ON public.orders;
CREATE POLICY "Tenant queue read access" ON public.orders
    FOR SELECT TO authenticated
  USING (public.can_access_order_queue());

DROP POLICY IF EXISTS "Tenant queue order item read access" ON public.order_items;
CREATE POLICY "Tenant queue order item read access" ON public.order_items
    FOR SELECT TO authenticated
  USING (public.can_access_order_queue());