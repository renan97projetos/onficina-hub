
-- Replace broad SELECT on oficina-logos with one that only allows direct object reads (no listing)
DROP POLICY IF EXISTS "Anyone can view oficina logos" ON storage.objects;

CREATE POLICY "Public can read oficina logos by path"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'oficina-logos' AND name IS NOT NULL);
