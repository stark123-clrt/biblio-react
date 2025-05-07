/*
  # Fix storage configuration and ensure public access
  
  1. Changes
    - Create storage bucket if it doesn't exist
    - Make bucket public
    - Add unrestricted public access policy
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('library', 'library', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop any existing policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
    DROP POLICY IF EXISTS "Admin users can upload files" ON storage.objects;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Create a single public policy for all storage operations
CREATE POLICY "Public Access"
ON storage.objects
FOR ALL 
TO public
USING (true)
WITH CHECK (true);