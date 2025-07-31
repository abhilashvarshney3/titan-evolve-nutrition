-- Insert the Titan Evolve products into the products table
INSERT INTO public.products (id, name, description, price, image_url, category_id, stock_quantity, is_featured, is_new, sku) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Titan Evolve – Creatine Monohydrate (Unflavored)', '200 Mesh Ultra Micronized Powder for strength and explosive power', 1199, '/lovable-uploads/LOGO.png', 'cat_1', 50, true, false, 'TE-CREAT-180'),
('550e8400-e29b-41d4-a716-446655440002', 'Titan Evolve – Pre-Workout (Watermelon)', 'Refreshing, juicy and slightly tangy pre-workout for explosive energy', 1750, '/lovable-uploads/LOGO.png', 'cat_2', 30, true, true, 'TE-PRE-WM-250'),
('550e8400-e29b-41d4-a716-446655440003', 'Titan Evolve – Pre-Workout (Bubblegum Burst)', 'Sweet & nostalgic candy burst with zero aftertaste', 1750, '/lovable-uploads/LOGO.png', 'cat_2', 25, false, true, 'TE-PRE-BB-250'),
('550e8400-e29b-41d4-a716-446655440004', 'Titan Evolve – Mass Gainer (Double Rich Chocolate) 2.7kg', 'Creamy, dense cocoa flavor — easy on the stomach', 2499, '/lovable-uploads/LOGO.png', 'cat_3', 20, true, false, 'TE-MG-DRC-2.7'),
('550e8400-e29b-41d4-a716-446655440005', 'Titan Evolve – Mass Gainer (Double Rich Chocolate) 4.5kg', 'Creamy, dense cocoa flavor — easy on the stomach', 3499, '/lovable-uploads/LOGO.png', 'cat_3', 15, false, false, 'TE-MG-DRC-4.5'),
('550e8400-e29b-41d4-a716-446655440006', 'Titan Evolve – Mass Gainer (Kesar Pista Delight) 2.7kg', 'A royal fusion of saffron and pistachio with warm, aromatic undertones', 2499, '/lovable-uploads/LOGO.png', 'cat_3', 18, false, true, 'TE-MG-KPD-2.7'),
('550e8400-e29b-41d4-a716-446655440007', 'Titan Evolve – Mass Gainer (Kesar Pista Delight) 4.5kg', 'A royal fusion of saffron and pistachio with warm, aromatic undertones', 3499, '/lovable-uploads/LOGO.png', 'cat_3', 12, false, true, 'TE-MG-KPD-4.5'),
('550e8400-e29b-41d4-a716-446655440008', 'Titan Evolve – Lean Whey Protein (Double Rich Chocolate)', 'Deep, rich cocoa with a clean finish - 25g protein per serving', 4999, '/lovable-uploads/LOGO.png', 'cat_4', 35, true, false, 'TE-WP-DRC-2KG');

-- Insert categories if they don't exist
INSERT INTO public.categories (id, name, description) VALUES
('cat_1', 'Creatine', 'Pure creatine monohydrate for strength and power'),
('cat_2', 'Pre-Workout', 'Energy and pump formulas for peak performance'),
('cat_3', 'Mass Gainer', 'Quality calories for clean bulking'),
('cat_4', 'Whey Protein', 'Premium whey protein for muscle growth')
ON CONFLICT (id) DO NOTHING;