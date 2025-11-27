-- =====================================================
-- FEEDBACK FORM DATABASE SCHEMA
-- =====================================================
-- This schema creates tables for storing user feedback
-- with proper constraints, indexes, and RLS policies.
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL CHECK (category IN ('UI', 'Performance', 'Feature', 'Other')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public feedback form)
CREATE POLICY "Anyone can insert users" 
ON public.users 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view users" 
ON public.users 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Anyone can insert feedback" 
ON public.feedback 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can view feedback" 
ON public.feedback 
FOR SELECT 
TO public
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for automatic timestamp updates on users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =====================================================
-- NOTES:
-- - The users table stores basic user information
-- - The email field is unique to prevent duplicates
-- - The feedback table references users via user_id
-- - Rating is constrained between 1 and 5
-- - Category is constrained to specific values
-- - Indexes improve query performance
-- - RLS policies allow public access (adjust for production)
-- - Automatic timestamps track when records are created/updated
-- =====================================================
