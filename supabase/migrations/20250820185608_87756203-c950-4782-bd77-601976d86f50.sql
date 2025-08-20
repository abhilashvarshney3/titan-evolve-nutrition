-- Fix RLS policies for variant_images to allow proper admin access
DROP POLICY IF EXISTS "Admins can manage variant images" ON public.variant_images;
DROP POLICY IF EXISTS "Anyone can view variant images" ON public.variant_images;

-- Create proper RLS policies for variant_images
CREATE POLICY "Admins can manage variant images" 
ON public.variant_images 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view variant images" 
ON public.variant_images 
FOR SELECT 
USING (true);

-- Also ensure the storage bucket policies are correct for admin uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('variant-images', 'variant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies for variant images
INSERT INTO storage.objects (bucket_id, name, owner, metadata) 
SELECT 'variant-images', 'test', auth.uid(), '{}' 
WHERE FALSE; -- This won't insert anything, just ensures the bucket exists

-- Create storage policies for variant images
DO $$
BEGIN
  -- Check if policies already exist and drop them if they do
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Admins can manage variant images in storage'
  ) THEN
    DROP POLICY "Admins can manage variant images in storage" ON storage.objects;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Anyone can view variant images in storage'
  ) THEN
    DROP POLICY "Anyone can view variant images in storage" ON storage.objects;
  END IF;
END $$;

-- Create storage policies for variant images
CREATE POLICY "Admins can manage variant images in storage"
ON storage.objects 
FOR ALL 
USING (
  bucket_id IN ('product-images', 'variant-images') AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id IN ('product-images', 'variant-images') AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Anyone can view variant images in storage"
ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('product-images', 'variant-images'));