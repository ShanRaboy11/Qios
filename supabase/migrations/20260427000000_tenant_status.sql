-- Add tenant status enum
CREATE TYPE public.tenant_status_enum AS ENUM ('pending', 'approved', 'rejected');

-- Add status column to tenants table
ALTER TABLE public.tenants
ADD COLUMN status public.tenant_status_enum NOT NULL DEFAULT 'pending';
