/*
  # Create reading progress table
  
  1. New Tables
    - `reading_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `book_id` (uuid, foreign key to books)
      - `current_page` (integer)
      - `last_read` (timestamp)
*/

CREATE TABLE IF NOT EXISTS public.reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  book_id uuid REFERENCES public.books(id),
  current_page integer NOT NULL,
  last_read timestamptz DEFAULT now(),
  UNIQUE(user_id, book_id)
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reading progress is viewable by the owner" 
  ON public.reading_progress 
  FOR SELECT 
  TO public 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading progress" 
  ON public.reading_progress 
  FOR INSERT 
  TO public 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading progress" 
  ON public.reading_progress 
  FOR UPDATE 
  TO public 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);