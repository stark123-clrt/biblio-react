/*
  # Create users table
  
  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
*/

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are viewable by everyone" 
  ON public.users 
  FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Users can insert their own data" 
  ON public.users 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  TO public 
  USING (true)
  WITH CHECK (true);