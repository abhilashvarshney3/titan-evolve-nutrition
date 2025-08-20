-- Add variant images table for multiple images per variant
CREATE TABLE IF NOT EXISTS variant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE variant_images ENABLE ROW LEVEL SECURITY;

-- Create policies for variant images
CREATE POLICY "Anyone can view variant images" ON variant_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage variant images" ON variant_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default variant images
INSERT INTO variant_images (variant_id, image_url, is_primary) VALUES
-- Lean Whey Protein variants
('550e8400-e29b-41d4-a716-446655440101', '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', true),
('550e8400-e29b-41d4-a716-446655440102', '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', true),
('550e8400-e29b-41d4-a716-446655440103', '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', true),
('550e8400-e29b-41d4-a716-446655440104', '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png', true),
-- Mass Gainer variants
('550e8400-e29b-41d4-a716-446655440201', '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', true),
('550e8400-e29b-41d4-a716-446655440202', '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', true),
('550e8400-e29b-41d4-a716-446655440203', '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', true),
('550e8400-e29b-41d4-a716-446655440204', '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png', true),
-- Pre-Workout variants
('550e8400-e29b-41d4-a716-446655440301', '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', true),
('550e8400-e29b-41d4-a716-446655440302', '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', true),
('550e8400-e29b-41d4-a716-446655440303', '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', true),
('550e8400-e29b-41d4-a716-446655440304', '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png', true),
-- Creatine variants
('550e8400-e29b-41d4-a716-446655440401', '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png', true),
('550e8400-e29b-41d4-a716-446655440402', '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png', true);