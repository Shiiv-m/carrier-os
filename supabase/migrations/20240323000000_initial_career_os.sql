-- Create jobs table for the Kanban board tracker
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected')),
  description TEXT,
  resume_version_url TEXT,
  applied_date TIMESTAMP WITH TIME ZONE,
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (if not exists) to store additional user info like points and badges
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  linkedin_url TEXT,
  current_company TEXT,
  verified_professional BOOLEAN DEFAULT FALSE,
  karma_points INTEGER DEFAULT 0,
  successful_hires INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table for the Peer Review System
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID NOT NULL, -- Assuming there's a resumes table
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  review_text TEXT NOT NULL,
  is_anonymized BOOLEAN DEFAULT TRUE,
  hired_me BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can manage their own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can edit their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Verified professionals can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND verified_professional = TRUE
    )
  );
