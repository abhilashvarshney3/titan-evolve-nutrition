-- Add used_at column to verification_codes table
ALTER TABLE public.verification_codes 
ADD COLUMN used_at TIMESTAMP WITH TIME ZONE;

-- Create an admin interface table for bulk code uploads
CREATE TABLE public.code_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  total_codes INTEGER NOT NULL DEFAULT 0,
  uploaded_codes INTEGER NOT NULL DEFAULT 0,
  failed_codes INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_log JSONB
);

-- Enable RLS for code_uploads
ALTER TABLE public.code_uploads ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage code uploads
CREATE POLICY "Admins can manage code uploads" 
ON public.code_uploads 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Update trigger for code_uploads
CREATE TRIGGER update_code_uploads_updated_at
BEFORE UPDATE ON public.code_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();