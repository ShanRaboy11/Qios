DROP POLICY IF EXISTS "Tenant queue read access" ON public.orders;
CREATE POLICY "Tenant queue read access" ON public.orders
    FOR SELECT TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

DROP POLICY IF EXISTS "Tenant queue order item read access" ON public.order_items;
CREATE POLICY "Tenant queue order item read access" ON public.order_items
    FOR SELECT TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );