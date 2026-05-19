-- Add new columns to categories if they don't exist
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS icon TEXT;

-- Add new columns to menu_items if they don't exist
ALTER TABLE public.menu_items
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS addons_enabled BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS addons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '[]'::jsonb;

-- Create Storage bucket for menu-images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for menu-images
DROP POLICY IF EXISTS "Menu images are publicly accessible" ON storage.objects;
CREATE POLICY "Menu images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
CREATE POLICY "Authenticated users can update menu images" ON storage.objects
  FOR UPDATE TO authenticated WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'menu-images');

-- Ensure categories are readable by everyone
DROP POLICY IF EXISTS "Enable read access for all categories" ON public.categories;
CREATE POLICY "Enable read access for all categories" ON public.categories
    FOR SELECT USING (true);

-- Ensure menu_items are readable by everyone
DROP POLICY IF EXISTS "Enable read access for all menu items" ON public.menu_items;
CREATE POLICY "Enable read access for all menu items" ON public.menu_items
    FOR SELECT USING (true);

-- Ensure authenticated users can modify categories
DROP POLICY IF EXISTS "Enable write access for authenticated users on categories" ON public.categories;
CREATE POLICY "Enable write access for authenticated users on categories" ON public.categories
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );

-- Ensure authenticated users can modify menu_items
DROP POLICY IF EXISTS "Enable write access for authenticated users on menu items" ON public.menu_items;
CREATE POLICY "Enable write access for authenticated users on menu items" ON public.menu_items
    FOR ALL TO authenticated
    USING (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    )
    WITH CHECK (
        tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
        OR (auth.jwt() ->> 'role') = 'super_admin'
    );
