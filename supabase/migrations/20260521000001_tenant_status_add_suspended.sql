-- Add suspended status to tenant_status_enum so suspended tenants can be persisted.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'tenant_status_enum'
      AND e.enumlabel = 'suspended'
  ) THEN
    ALTER TYPE public.tenant_status_enum ADD VALUE 'suspended';
  END IF;
END;
$$;
