-- First, let's update the existing products to match correct specifications
-- and add proper variant structure

-- Update products with correct names and categories
UPDATE products SET 
  name = 'Titan Evolve – Lean Whey Protein',
  description = 'Premium quality whey protein for muscle building and recovery. Made from the finest ingredients to support your fitness goals.',
  price = 4999,
  image_url = '/lovable-uploads/e4203b92-71c2-4636-8682-1cc573310fbc.png',
  is_featured = true,
  is_new = true
WHERE id = '550e8400-e29b-41d4-a716-446655440008';

UPDATE products SET 
  name = 'Titan Evolve – Mass Gainer',
  description = 'Advanced mass gainer formula with high-quality proteins and carbohydrates to support muscle growth and weight gain.',
  price = 3499,
  image_url = '/lovable-uploads/a651e1df-5241-402e-ba83-0b47d9206364.png',
  is_featured = true,
  is_new = false
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE products SET 
  name = 'Titan Evolve – Pre-Workout',
  description = 'Explosive pre-workout formula designed to boost energy, focus, and performance during intense training sessions.',
  price = 1750,
  image_url = '/lovable-uploads/0463eb82-5280-4ac1-bb44-988ac181e84e.png',
  is_featured = true,
  is_new = true
WHERE id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE products SET 
  name = 'Titan Evolve – Creatine Monohydrate',
  description = 'Pure creatine monohydrate powder for enhanced strength, power, and muscle volume. Unflavored and easily mixable.',
  price = 1199,
  image_url = '/lovable-uploads/53024968-45ea-468d-8d9f-f24037b79f25.png',
  is_featured = true,
  is_new = false
WHERE id = '550e8400-e29b-41d4-a716-446655440003';

-- Clear existing variants to recreate with correct specifications
DELETE FROM product_variants;

-- Insert correct variants as per user specifications with proper UUIDs

-- 1. Lean Whey Protein: 2 Flavors (Double Rich Chocolate & American Ice Cream) × 2 Sizes (2KGs and 4KGs)
INSERT INTO product_variants (id, product_id, variant_name, flavor, size, price, stock_quantity, sku) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440008', 'Double Rich Chocolate 2KG', 'Double Rich Chocolate', '2KG', 4999, 35, 'TE-LWP-DRC-2KG'),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440008', 'Double Rich Chocolate 4KG', 'Double Rich Chocolate', '4KG', 8999, 20, 'TE-LWP-DRC-4KG'),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440008', 'American Ice Cream 2KG', 'American Ice Cream', '2KG', 4999, 28, 'TE-LWP-AIC-2KG'),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440008', 'American Ice Cream 4KG', 'American Ice Cream', '4KG', 8999, 15, 'TE-LWP-AIC-4KG');

-- 2. Mass Gainer: 2 Flavors (Double Rich Chocolate & Kesar Pista) × 2 Sizes (6lbs & 10lbs)
INSERT INTO product_variants (id, product_id, variant_name, flavor, size, price, stock_quantity, sku) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440001', 'Double Rich Chocolate 6lbs', 'Double Rich Chocolate', '6lbs', 3499, 20, 'TE-MG-DRC-6LBS'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440001', 'Double Rich Chocolate 10lbs', 'Double Rich Chocolate', '10lbs', 4999, 15, 'TE-MG-DRC-10LBS'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440001', 'Kesar Pista 6lbs', 'Kesar Pista', '6lbs', 3499, 18, 'TE-MG-KP-6LBS'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440001', 'Kesar Pista 10lbs', 'Kesar Pista', '10lbs', 4999, 12, 'TE-MG-KP-10LBS');

-- 3. Pre-Workout: 2 Flavors (Watermelon & Bubblegum) × 2 Sizes (30 servings & 60 servings)
INSERT INTO product_variants (id, product_id, variant_name, flavor, size, price, stock_quantity, sku) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440002', 'Watermelon 30 servings', 'Watermelon', '30 servings', 1750, 30, 'TE-PRE-WM-30'),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440002', 'Watermelon 60 servings', 'Watermelon', '60 servings', 2999, 20, 'TE-PRE-WM-60'),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440002', 'Bubblegum 30 servings', 'Bubblegum', '30 servings', 1750, 25, 'TE-PRE-BB-30'),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440002', 'Bubblegum 60 servings', 'Bubblegum', '60 servings', 2999, 18, 'TE-PRE-BB-60');

-- 4. Creatine: Unflavored × 2 sizes (180 gms and 250 gms)
INSERT INTO product_variants (id, product_id, variant_name, flavor, size, price, stock_quantity, sku) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440003', 'Unflavored 180g', 'Unflavored', '180g', 1199, 50, 'TE-CREAT-180'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440003', 'Unflavored 250g', 'Unflavored', '250g', 1599, 35, 'TE-CREAT-250');