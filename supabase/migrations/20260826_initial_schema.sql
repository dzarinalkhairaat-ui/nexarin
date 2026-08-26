-- ==============================================================================
-- NEXARIN TECH HUB — DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  company TEXT,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ARTICLE CATEGORIES
CREATE TABLE IF NOT EXISTS public.article_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  source_id TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.article_categories(id) ON DELETE CASCADE,
  featured_image TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_name TEXT NOT NULL DEFAULT 'Redaksi Nexarin',
  author_avatar TEXT,
  read_time_minutes INT NOT NULL DEFAULT 5,
  views_count INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  gemini_score NUMERIC(3, 1),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ARTICLE TAGS
CREATE TABLE IF NOT EXISTS public.article_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.article_tag_relations (
  article_id TEXT NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.article_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- 5. EDITORIAL STAGING DRAFTS (Gemini Spark & Google Sheets Sync)
CREATE TABLE IF NOT EXISTS public.editorial_drafts (
  id TEXT PRIMARY KEY,
  sheet_row_id INT,
  source_url TEXT,
  source_name TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  suggested_content TEXT NOT NULL,
  suggested_category TEXT NOT NULL,
  suggested_tags TEXT[] DEFAULT '{}',
  gemini_score NUMERIC(3, 1) NOT NULL DEFAULT 8.5,
  status TEXT NOT NULL DEFAULT 'draft_ready' CHECK (status IN ('draft_ready', 'reviewing', 'approved', 'published', 'rejected')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AFFILIATE LINKS & TRACKING
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price INT NOT NULL,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.8,
  image_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  commission_rate TEXT,
  clicks_count INT NOT NULL DEFAULT 0,
  conversions_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCTS (Digital Software, Starter Kits, Templates)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  price INT NOT NULL,
  original_price INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  category TEXT NOT NULL CHECK (category IN ('applications', 'templates', 'starter-kits')),
  license_type TEXT NOT NULL DEFAULT 'lifetime' CHECK (license_type IN ('lifetime', 'single-site', 'extended')),
  trial_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  trial_duration_days INT NOT NULL DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9,
  sales_count INT NOT NULL DEFAULT 0,
  cover_image TEXT NOT NULL,
  download_url TEXT NOT NULL,
  demo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCT VERSIONS & RELEASES
CREATE TABLE IF NOT EXISTS public.product_versions (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  download_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  release_notes TEXT[] DEFAULT '{}',
  is_latest BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, version)
);

-- 9. PRODUCT TRIALS (3-Day Requests)
CREATE TABLE IF NOT EXISTS public.product_trials (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  institution TEXT,
  trial_key TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ORDERS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_version TEXT NOT NULL,
  amount INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  payment_method TEXT NOT NULL,
  payment_provider TEXT DEFAULT 'manual_or_gateway',
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. LIFETIME LICENSES
CREATE TABLE IF NOT EXISTS public.licenses (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL UNIQUE,
  user_id UUID,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  license_type TEXT NOT NULL DEFAULT 'lifetime' CHECK (license_type IN ('lifetime', 'single-site', 'extended', 'trial')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  activations_count INT NOT NULL DEFAULT 1,
  max_activations INT NOT NULL DEFAULT 3,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SECURE DOWNLOADS LOG
CREATE TABLE IF NOT EXISTS public.downloads (
  id TEXT PRIMARY KEY,
  user_id UUID,
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  version_id TEXT,
  download_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID,
  recipient_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'update', 'license', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOGS (Admin Operation Tracker)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON public.licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_customer ON public.licenses(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_notifications_customer ON public.notifications(recipient_email, is_read);

-- 15. FREE RESOURCES & COMMUNITY ASSETS
CREATE TABLE IF NOT EXISTS public.free_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  file_size TEXT NOT NULL,
  format TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT 'Featured Kit',
  download_url TEXT NOT NULL,
  downloads_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_free_resources_slug ON public.free_resources(slug);
