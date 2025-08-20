-- Add original_price column to product_variants table
ALTER TABLE public.product_variants 
ADD COLUMN original_price numeric DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.product_variants.original_price IS 'Original price before discount';