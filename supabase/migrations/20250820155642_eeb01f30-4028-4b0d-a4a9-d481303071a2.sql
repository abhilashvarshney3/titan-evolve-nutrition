-- Create product_variants table to handle different sizes and flavors
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL, -- e.g., "2KG - Double Rich Chocolate"
  flavor TEXT, -- e.g., "Double Rich Chocolate", "American Ice Cream", etc.
  size TEXT NOT NULL, -- e.g., "2KG", "4KG", "6lbs", "10lbs", etc.
  price NUMERIC NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for product_variants
CREATE POLICY "Anyone can view active product variants" 
ON public.product_variants 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage product variants" 
ON public.product_variants 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update cart table to reference product variants instead of just products
ALTER TABLE public.cart ADD COLUMN variant_id UUID REFERENCES public.product_variants(id);

-- Update order_items table to reference product variants
ALTER TABLE public.order_items ADD COLUMN variant_id UUID REFERENCES public.product_variants(id);

-- Update wishlist table to reference product variants
ALTER TABLE public.wishlist ADD COLUMN variant_id UUID REFERENCES public.product_variants(id);

-- Update reviews table to reference product variants for more specific reviews
ALTER TABLE public.reviews ADD COLUMN variant_id UUID REFERENCES public.product_variants(id);