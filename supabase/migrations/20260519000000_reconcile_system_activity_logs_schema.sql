DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'user_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'actor_id'
  ) THEN
    ALTER TABLE public.system_activity_logs RENAME COLUMN user_id TO actor_id;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'action'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'description'
  ) THEN
    ALTER TABLE public.system_activity_logs RENAME COLUMN action TO description;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'details'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'system_activity_logs'
      AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.system_activity_logs RENAME COLUMN details TO metadata;
  END IF;
END
$$;

ALTER TABLE public.system_activity_logs
  ADD COLUMN IF NOT EXISTS actor_name text,
  ADD COLUMN IF NOT EXISTS actor_role text DEFAULT 'Super Admin',
  ADD COLUMN IF NOT EXISTS action_type text,
  ADD COLUMN IF NOT EXISTS target_tenant_id uuid,
  ADD COLUMN IF NOT EXISTS target_tenant_name text;

UPDATE public.system_activity_logs
SET action_type = COALESCE(action_type, 'UPDATE')
WHERE action_type IS NULL;

ALTER TABLE public.system_activity_logs
  ALTER COLUMN action_type SET NOT NULL,
  ALTER COLUMN description SET NOT NULL;

ALTER TABLE public.system_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view system activity logs" ON public.system_activity_logs;
DROP POLICY IF EXISTS "Admins can insert system activity logs" ON public.system_activity_logs;
DROP POLICY IF EXISTS "Admins full access" ON public.system_activity_logs;

CREATE POLICY "Admins full access"
ON public.system_activity_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
  )
);
