create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_label text,
  status text not null default 'pending',
  total_amount numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_tenant_id on public.orders (tenant_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Policy fallback supports local Postgres by using app.current_tenant_id.
-- In Supabase, request.jwt.claim.tenant_id can be injected from JWT custom claims.
create policy tenant_select_orders
  on public.orders
  for select
  using (
    tenant_id::text = coalesce(
      nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
      nullif(current_setting('app.current_tenant_id', true), '')
    )
  );

create policy tenant_insert_orders
  on public.orders
  for insert
  with check (
    tenant_id::text = coalesce(
      nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
      nullif(current_setting('app.current_tenant_id', true), '')
    )
  );

create policy tenant_update_orders
  on public.orders
  for update
  using (
    tenant_id::text = coalesce(
      nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
      nullif(current_setting('app.current_tenant_id', true), '')
    )
  )
  with check (
    tenant_id::text = coalesce(
      nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
      nullif(current_setting('app.current_tenant_id', true), '')
    )
  );

create policy tenant_delete_orders
  on public.orders
  for delete
  using (
    tenant_id::text = coalesce(
      nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
      nullif(current_setting('app.current_tenant_id', true), '')
    )
  );
