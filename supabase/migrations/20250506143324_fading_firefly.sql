/*
  # Update Books RLS Policies

  1. Changes
    - Add RLS policy for admin users to manage books
    - Remove existing policy that requires user_id match
    - Update storage bucket policies for admin access

  2. Security
    - Maintain read access for all users
    - Grant full access to admin users
    - Ensure proper storage permissions for admin users
*/

-- Update books table policies
DROP POLICY IF EXISTS "Books can be modified by admin users" ON books;

CREATE POLICY "Admin users have full access to books"
ON books
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
  )
);

-- Update storage policies for the library bucket
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admin users can upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Admin users can upload files"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'library' 
    AND EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.users ON auth.users.id = public.users.id
      WHERE public.users.is_admin = true
      AND auth.users.id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'library'
    AND EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.users ON auth.users.id = public.users.id
      WHERE public.users.is_admin = true
      AND auth.users.id = auth.uid()
    )
  );

  CREATE POLICY "Anyone can view files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'library');
COMMIT;