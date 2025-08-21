-- Ensure product_details column can handle JSON data properly
ALTER TABLE public.product_variants 
ALTER COLUMN product_details TYPE TEXT;

-- Add a comment to clarify the expected format
COMMENT ON COLUMN public.product_variants.product_details IS 'JSON string containing array of {title, value} objects for variant-specific details';