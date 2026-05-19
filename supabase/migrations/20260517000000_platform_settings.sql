CREATE TABLE IF NOT EXISTS public.platform_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  platform_name text NOT NULL DEFAULT 'Qios',
  support_email text NOT NULL DEFAULT 'support@qios.com',
  default_currency text NOT NULL DEFAULT 'PHP',
  default_timezone text NOT NULL DEFAULT 'Asia/Manila',
  maintenance_mode boolean NOT NULL DEFAULT false,
  password_min_length integer NOT NULL DEFAULT 8,
  session_timeout_hours integer NOT NULL DEFAULT 24,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert the single row if it does not exist
INSERT INTO public.platform_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_platform_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_platform_settings_timestamp ON public.platform_settings;
CREATE TRIGGER set_platform_settings_timestamp
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_platform_settings_timestamp();

-- RLS policies
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users (so they can see maintenance mode etc.)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.platform_settings;
CREATE POLICY "Enable read access for authenticated users"
ON public.platform_settings FOR SELECT
TO authenticated
USING (true);

-- Allow update access only to super_admins
DROP POLICY IF EXISTS "Enable update for super admins" ON public.platform_settings;
CREATE POLICY "Enable update for super admins"
ON public.platform_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'super_admin'
  )
);