
-- Make bucket public
UPDATE storage.buckets SET public = true WHERE id = 'os-fotos';

-- Allow public read
CREATE POLICY "Public can read os-fotos"
ON storage.objects FOR SELECT
USING (bucket_id = 'os-fotos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload os-fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'os-fotos');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete os-fotos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'os-fotos');
