/*
  # Make all tables and storage public
  
  1. Changes
    - Remove RLS from all tables
    - Make storage bucket public
    - Create public access policies
*/

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress DISABLE ROW LEVEL SECURITY;

-- Make storage bucket public and accessible
UPDATE storage.buckets
SET public = true
WHERE id = 'library';

-- Create public access policy for storage
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Cover images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read PDF files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their files" ON storage.objects;

-- Create a single public policy for all storage operations
CREATE POLICY "Public Access"
ON storage.objects
FOR ALL 
TO public
USING (bucket_id = 'library')
WITH CHECK (bucket_id = 'library');