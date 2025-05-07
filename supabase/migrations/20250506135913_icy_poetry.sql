/*
  # Create categories table
  
  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
*/

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Categories can be modified by admin users" 
  ON public.categories 
  FOR ALL 
  TO public 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );