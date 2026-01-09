-- Add new columns for big discount and product highlighting
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_big_discount BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false;