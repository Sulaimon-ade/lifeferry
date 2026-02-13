/*
  # Create Media Storage Bucket

  1. Storage
    - Create a public 'media' bucket for storing images and media files
    - Allow public access to uploaded files
    - Set file size limit to 50MB
  
  2. Security
    - Allow authenticated users (admins) to upload files
    - Allow public read access to all files
    - Restrict delete operations to authenticated users
*/

-- Create the media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Allow public read access to all media files
CREATE POLICY "Public can view media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'media');