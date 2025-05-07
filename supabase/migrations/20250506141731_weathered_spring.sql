/*
  # Fix categories RLS policies

  1. Security
    - Enable RLS on categories table
    - Add policy for public viewing of categories
    - Add policy for admin management of categories
*/

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
  DROP POLICY IF EXISTS "Categories can be managed by admin users" ON categories;
  
  -- Create new policies
  CREATE POLICY "Categories are viewable by everyone"
    ON categories
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Categories can be managed by admin users"
    ON categories
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
      )
    );
END $$;