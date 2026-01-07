-- Add price_label column and make price nullable
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price_label TEXT;

ALTER TABLE public.products ALTER COLUMN price DROP NOT NULL;