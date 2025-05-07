/*
  # Update categories RLS policies

  1. Changes
    - Remove existing RLS policies
    - Create new public access policy for all operations
    - Make categories table fully public
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories can be managed by admin users" ON categories;
DROP POLICY IF EXISTS "Categories can be modified by admin users" ON categories;

-- Create new public access policy
CREATE POLICY "Categories are public"
  ON categories
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);