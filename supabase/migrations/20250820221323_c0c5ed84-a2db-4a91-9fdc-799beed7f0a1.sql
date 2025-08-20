-- Create coupons table for discount management
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  minimum_order_amount NUMERIC DEFAULT 0,
  maximum_discount_amount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Coupons policies
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create affiliate_programs table
CREATE TABLE public.affiliate_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  commission_rate NUMERIC NOT NULL,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('percentage', 'fixed')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for affiliate_programs
ALTER TABLE public.affiliate_programs ENABLE ROW LEVEL SECURITY;

-- Affiliate programs policies
CREATE POLICY "Anyone can view active affiliate programs" ON public.affiliate_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage affiliate programs" ON public.affiliate_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create promoters table for affiliate users
CREATE TABLE public.promoters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_program_id UUID REFERENCES public.affiliate_programs(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for promoters
ALTER TABLE public.promoters ENABLE ROW LEVEL SECURITY;

-- Promoters policies
CREATE POLICY "Users can view own promoter data" ON public.promoters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage promoters" ON public.promoters FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create banners table for promotional banners
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  button_text TEXT,
  banner_type TEXT NOT NULL CHECK (banner_type IN ('hero', 'promotional', 'announcement', 'offer')),
  position TEXT DEFAULT 'top',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Banners policies
CREATE POLICY "Anyone can view active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage banners" ON public.banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create site_settings table for general site configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('text', 'number', 'boolean', 'json', 'image', 'url')),
  category TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies
CREATE POLICY "Anyone can view public settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins can manage all settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create order_tracking table for order status updates
CREATE TABLE public.order_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for order_tracking
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Order tracking policies
CREATE POLICY "Users can view own order tracking" ON public.order_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_tracking.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage order tracking" ON public.order_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create referrals table for tracking referral sales
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promoter_id UUID REFERENCES public.promoters(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Promoters can view own referrals" ON public.referrals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.promoters WHERE id = referrals.promoter_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage referrals" ON public.referrals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
('site_name', '"Titan Evolve"', 'text', 'general', 'Site name displayed in header', true),
('site_tagline', '"Premium Nutrition for Athletes"', 'text', 'general', 'Site tagline', true),
('hero_title', '"TITAN EVOLVE"', 'text', 'hero', 'Main hero title', true),
('hero_subtitle', '"Born for athletes. Built by the relentless. Driven by discipline."', 'text', 'hero', 'Hero subtitle', true),
('hero_description', '"Premium Indian supplements backed by science, driven by performance."', 'text', 'hero', 'Hero description', true),
('contact_email', '"titanevolvenutrition.care@gmail.com"', 'text', 'contact', 'Contact email address', true),
('contact_phone', '"+91 9211991181"', 'text', 'contact', 'Contact phone number', true),
('contact_address', '"No.007, Perody Maison, Bilekahalli, Banglore-560076"', 'text', 'contact', 'Contact address', true),
('about_vision', '"To become India\'s most trusted and performance-first supplement brand — combining elite-level quality, scientific formulation, and a community culture that empowers athletes across all disciplines."', 'text', 'about', 'Company vision', true),
('shipping_info', '"Free shipping on orders above ₹999"', 'text', 'general', 'Shipping information', true),
('return_policy', '"30-day return policy"', 'text', 'general', 'Return policy', true);

-- Create update triggers for timestamps
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_affiliate_programs_updated_at BEFORE UPDATE ON public.affiliate_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_promoters_updated_at BEFORE UPDATE ON public.promoters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();