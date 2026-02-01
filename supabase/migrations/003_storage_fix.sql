-- 1. Create the storage bucket 'portfolio-images'
-- We use a safe insert that handles conflicts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-images', 'portfolio-images', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create Policies for Access
-- Note: We skipped 'ALTER TABLE' as it causes permission errors. RLS is on by default.

-- Drop policies to avoid duplicates (Use DO block to handle errors gracefully if needed, but DROP IF EXISTS is standard)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Re-create Policies

-- Public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-images' );

-- Authenticated Uploads
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT
TO authenticated WITH CHECK ( bucket_id = 'portfolio-images' );

-- Authenticated Updates
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE
TO authenticated USING ( bucket_id = 'portfolio-images' );

-- Authenticated Deletes
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE
TO authenticated USING ( bucket_id = 'portfolio-images' );
