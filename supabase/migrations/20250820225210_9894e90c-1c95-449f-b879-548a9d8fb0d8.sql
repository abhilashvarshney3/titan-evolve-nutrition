-- Create coupon_usage table to track individual coupon applications
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage coupon usage" 
ON public.coupon_usage 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Users can view their own coupon usage" 
ON public.coupon_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to update coupon used_count automatically
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update coupon usage count
CREATE TRIGGER update_coupon_usage_count_trigger
  AFTER INSERT ON public.coupon_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_coupon_usage_count();