
-- Create verification_codes table for product authentication
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES public.products(id),
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage verification codes
CREATE POLICY "Admins can manage verification codes" 
  ON public.verification_codes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policy for anyone to view verification codes (needed for verification)
CREATE POLICY "Anyone can view verification codes" 
  ON public.verification_codes 
  FOR SELECT 
  USING (true);

-- Create policy for updating verification codes when used
CREATE POLICY "Allow verification code usage updates"
  ON public.verification_codes
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON public.verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_is_used ON public.verification_codes(is_used);
