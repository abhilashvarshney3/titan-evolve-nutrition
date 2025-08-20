-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.update_coupon_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the coupon's used_count
  UPDATE public.coupons 
  SET used_count = used_count + 1,
      updated_at = now()
  WHERE id = NEW.coupon_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';