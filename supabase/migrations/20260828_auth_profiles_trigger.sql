-- ==============================================================================
-- NEXARIN TECH HUB — AUTHENTICATION & PROFILES TRIGGER (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Ensure public.profiles table exists with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  company TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. AUTOMATIC TRIGGER FUNCTION WHEN A USER REGISTERS VIA GOOGLE OR EMAIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_avatar TEXT;
  user_role TEXT;
  user_company TEXT;
BEGIN
  -- Extract name from metadata or email
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Extract avatar
  user_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  );

  -- Determine role (admin for admin@nexarin.tech, customer for others)
  IF NEW.email = 'admin@nexarin.tech' OR NEW.email ILIKE '%@nexarin.tech' THEN
    user_role := 'admin';
  ELSE
    user_role := 'customer';
  END IF;

  user_company := NEW.raw_user_meta_data->>'company';

  -- Insert or update into public.profiles
  INSERT INTO public.profiles (id, email, name, avatar_url, role, company, permissions, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_avatar,
    user_role,
    user_company,
    CASE WHEN user_role = 'admin' THEN ARRAY['all', 'editorial', 'shop', 'affiliate', 'analytics'] ELSE ARRAY[]::TEXT[] END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. INITIAL SEED PROFILES (For pre-existing or direct reference)
INSERT INTO public.profiles (id, email, name, avatar_url, role, company, permissions)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'admin@nexarin.tech',
    'Rins (Administrator)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    'admin',
    'Nexarin Tech HQ',
    ARRAY['all', 'editorial', 'shop', 'affiliate', 'analytics']
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'ahmad.fadillah@example.com',
    'Ahmad Fadillah',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    'customer',
    'SMA Nusantara Digital',
    ARRAY[]::TEXT[]
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;
