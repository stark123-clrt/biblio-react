/*
  # Create notes table
  
  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `book_id` (uuid, foreign key to books)
      - `note_text` (text)
      - `page_number` (integer)
      - `created_at` (timestamp)
*/

CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  book_id uuid REFERENCES public.books(id),
  note_text text NOT NULL,
  page_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes are viewable by their owners" 
  ON public.notes 
  FOR SELECT 
  TO public 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" 
  ON public.notes 
  FOR INSERT 
  TO public 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.notes 
  FOR UPDATE 
  TO public 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);