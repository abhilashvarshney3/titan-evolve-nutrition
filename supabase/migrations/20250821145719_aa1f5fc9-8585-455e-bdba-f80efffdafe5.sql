-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.sms_otp 
  WHERE expires_at < NOW() - INTERVAL '10 minutes';
END;
$$;