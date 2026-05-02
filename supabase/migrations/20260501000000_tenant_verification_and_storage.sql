-- Add verification fields to tenants table
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS verification_doc_urls JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS admin_comments TEXT;

-- Restrict updates to these specific fields to Super Admins only
-- (Assuming we will enforce this via business logic in Server Actions as well,
-- but a trigger or strict policy could be added. We'll rely on global RLS and Server Action role checks.)

-- Set up the verification-docs storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-docs', 'verification-docs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for the bucket
-- Allow authenticated users (business owners) to insert docs
CREATE POLICY "Allow authenticated uploads to verification-docs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'verification-docs');

-- Allow service_role (admin backend) to insert docs
CREATE POLICY "Allow service_role uploads to verification-docs"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'verification-docs');

-- Allow authenticated users to read docs
CREATE POLICY "Allow authenticated read to verification-docs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'verification-docs');

-- Allow service_role to read docs
CREATE POLICY "Allow service_role read to verification-docs"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'verification-docs');

-- Allow service_role to update docs
CREATE POLICY "Allow service_role update to verification-docs"
ON storage.objects
FOR UPDATE
TO service_role
WITH CHECK (bucket_id = 'verification-docs');
