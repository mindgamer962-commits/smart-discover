-- Fix all missing columns in one go
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_big_discount BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_keywords TEXT;