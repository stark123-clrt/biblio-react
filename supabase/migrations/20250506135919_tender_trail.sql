/*
  # Create comments table
  
  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `book_id` (uuid, foreign key to books)
      - `comment_text` (text)
      - `rating` (integer)
      - `is_validated` (boolean)
      - `created_at` (timestamp)
*/

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  book_id uuid REFERENCES public.books(id),
  comment_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  is_validated boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Users can insert their own comments" 
  ON public.comments 
  FOR INSERT 
  TO public 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
  ON public.comments 
  FOR UPDATE 
  TO public 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);