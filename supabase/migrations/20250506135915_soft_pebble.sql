/*
  # Create books table
  
  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category_id` (uuid, foreign key to categories)
      - `file_path` (text)
      - `cover_image` (text)
      - `author` (text)
      - `publication_year` (integer)
      - `page_count` (integer)
      - `created_at` (timestamp)
*/

CREATE TABLE IF NOT EXISTS public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES public.categories(id),
  file_path text,
  cover_image text,
  author text NOT NULL,
  publication_year integer,
  page_count integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are viewable by everyone" 
  ON public.books 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Books can be modified by admin users" 
  ON public.books 
  FOR ALL 
  TO public 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );