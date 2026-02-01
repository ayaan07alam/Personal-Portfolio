-- Increase file size limit to 500MB (524288000 bytes)
-- This updates the existing bucket configuration
UPDATE storage.buckets
SET file_size_limit = 524288000,
    allowed_mime_types = NULL
WHERE id = 'portfolio-images';
