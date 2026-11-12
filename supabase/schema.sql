-- ============================================================================
-- HIHO (Healthy Inside Healthy Outside) - Supabase PostgreSQL Schema
-- Jalankan script ini di Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Tabel `diseases` (Direktori Penyakit & Panduan Makanan)
CREATE TABLE IF NOT EXISTS public.diseases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  indonesian_name TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  category_label TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT '🩺',
  summary TEXT NOT NULL,
  pathophysiology TEXT NOT NULL DEFAULT '',
  criteria TEXT,
  risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  health_impacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  quick_allowed JSONB NOT NULL DEFAULT '[]'::jsonb,
  quick_avoid JSONB NOT NULL DEFAULT '[]'::jsonb,
  allowed_foods JSONB NOT NULL DEFAULT '[]'::jsonb,
  avoid_foods JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_meal_plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel `articles` (Artikel & Wawasan Gizi Klinis)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  reading_time TEXT NOT NULL DEFAULT '4 menit baca',
  publish_date TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Tim Dokter & Dietisien HIHO',
  reviewer TEXT NOT NULL DEFAULT 'dr. Sarah Daniswara, Sp.GK',
  cover_gradient TEXT NOT NULL DEFAULT 'from-emerald-100 to-teal-50',
  image_url TEXT,
  raw_content TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  key_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
  content_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  "references" JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Index untuk performa query & sorting
CREATE INDEX IF NOT EXISTS idx_diseases_category ON public.diseases (category);
CREATE INDEX IF NOT EXISTS idx_diseases_created_at ON public.diseases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles (created_at DESC);

-- 4. Fungsi & Trigger otomatis untuk kolom `updated_at`
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_diseases_updated_at ON public.diseases;
CREATE TRIGGER set_diseases_updated_at
  BEFORE UPDATE ON public.diseases
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy akses publik & CRUD aplikasi menggunakan anon key
-- (Catatan: Sesuaikan policy WRITE jika suatu saat mengaktifkan Supabase Auth)
DROP POLICY IF EXISTS "Public read diseases" ON public.diseases;
CREATE POLICY "Public read diseases"
  ON public.diseases FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert diseases" ON public.diseases;
CREATE POLICY "Allow insert diseases"
  ON public.diseases FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update diseases" ON public.diseases;
CREATE POLICY "Allow update diseases"
  ON public.diseases FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete diseases" ON public.diseases;
CREATE POLICY "Allow delete diseases"
  ON public.diseases FOR DELETE
  USING (true);

DROP POLICY IF EXISTS "Public read articles" ON public.articles;
CREATE POLICY "Public read articles"
  ON public.articles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert articles" ON public.articles;
CREATE POLICY "Allow insert articles"
  ON public.articles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update articles" ON public.articles;
CREATE POLICY "Allow update articles"
  ON public.articles FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete articles" ON public.articles;
CREATE POLICY "Allow delete articles"
  ON public.articles FOR DELETE
  USING (true);

-- 6. Aktifkan Supabase Realtime pada kedua tabel
ALTER TABLE public.diseases REPLICA IDENTITY FULL;
ALTER TABLE public.articles REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'diseases'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.diseases;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'articles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
  END IF;
END $$;

-- 7. Segarkan schema cache PostgREST agar API langsung mengenali tabel baru
NOTIFY pgrst, 'reload schema';

