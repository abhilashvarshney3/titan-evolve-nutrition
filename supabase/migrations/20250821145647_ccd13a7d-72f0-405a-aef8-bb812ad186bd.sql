-- Create storage buckets for legal documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('legal-documents', 'legal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for legal documents bucket
CREATE POLICY "Admins can manage legal documents" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (
  bucket_id = 'legal-documents' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'::user_role
  )
)
WITH CHECK (
  bucket_id = 'legal-documents' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'::user_role
  )
);

CREATE POLICY "Anyone can view legal documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'legal-documents');

-- Create sms_otp table for OTP functionality
CREATE TABLE public.sms_otp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on sms_otp table
ALTER TABLE public.sms_otp ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sms_otp
CREATE POLICY "Users can create OTP entries" 
ON public.sms_otp 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can verify their own OTP" 
ON public.sms_otp 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can view their own OTP entries" 
ON public.sms_otp 
FOR SELECT 
USING (true);

-- Create function to cleanup expired OTP codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.sms_otp 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$;