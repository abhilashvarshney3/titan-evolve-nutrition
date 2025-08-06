-- Fix the RLS policy for code_uploads table
DROP POLICY IF EXISTS "Admins can manage code uploads" ON public.code_uploads;

-- Create proper policy with both USING and WITH CHECK clauses
CREATE POLICY "Admins can manage code uploads" 
ON public.code_uploads 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Also ensure the current user has admin role
-- First check if the user exists in profiles
INSERT INTO public.profiles (id, email, role, first_name, last_name)
VALUES (
  '1c496dba-ee6d-42ba-9cf8-2823cf3dc4c6',
  'abhilashvarshney3@gmail.com',
  'admin',
  'abhilash',
  'varshney'
) 
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';