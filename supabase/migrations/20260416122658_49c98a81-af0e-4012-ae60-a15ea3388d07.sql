
-- Drop the broad SELECT policy
DROP POLICY IF EXISTS "Anyone can view OS photos" ON storage.objects;

-- Create a more restrictive SELECT policy (only access specific files by path)
CREATE POLICY "Anyone can view OS photos by path"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'os-fotos' AND auth.role() = 'authenticated');

-- Allow anon to view specific photos (for client tracking page)
CREATE POLICY "Public can view OS photos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'os-fotos');

-- Make bucket private to prevent listing
UPDATE storage.buckets SET public = false WHERE id = 'os-fotos';
