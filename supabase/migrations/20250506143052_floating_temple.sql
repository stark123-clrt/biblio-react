/*
  # Create storage bucket for library files

  1. New Storage Bucket
    - Create 'library' bucket for storing:
      - Book PDF files
      - Book cover images
  
  2. Security
    - Enable public access for cover images
    - Restrict PDF access to authenticated users
    - Allow authenticated users to upload files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('library', 'library', true);

-- Policy to allow public access to cover images
CREATE POLICY "Cover images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'library' AND (storage.foldername(name))[1] = 'covers');

-- Policy to allow authenticated users to read PDF files
CREATE POLICY "Authenticated users can read PDF files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'library' AND (storage.foldername(name))[1] = 'books');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'library');

-- Policy to allow authenticated users to update their uploaded files
CREATE POLICY "Authenticated users can update their files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'library' AND owner = auth.uid())
WITH CHECK (bucket_id = 'library');

-- Policy to allow authenticated users to delete their uploaded files
CREATE POLICY "Authenticated users can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'library' AND owner = auth.uid());