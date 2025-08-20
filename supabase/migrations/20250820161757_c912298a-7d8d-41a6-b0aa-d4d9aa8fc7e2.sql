-- Add product variants for existing products
INSERT INTO product_variants (product_id, variant_name, flavor, size, price, stock_quantity, is_active, sku) VALUES
-- Creatine Monohydrate variants
('550e8400-e29b-41d4-a716-446655440001', 'Unflavored 180g', 'Unflavored', '180g', 1199.00, 50, true, 'TE-CREAT-180'),

-- Pre-Workout Watermelon variants  
('550e8400-e29b-41d4-a716-446655440002', 'Watermelon 250g', 'Watermelon', '250g', 1750.00, 30, true, 'TE-PRE-WM-250'),

-- Pre-Workout Bubblegum variants
('550e8400-e29b-41d4-a716-446655440003', 'Bubblegum Burst 250g', 'Bubblegum Burst', '250g', 1750.00, 25, true, 'TE-PRE-BB-250'),

-- Mass Gainer Double Rich Chocolate variants
('550e8400-e29b-41d4-a716-446655440004', 'Double Rich Chocolate 6lbs', 'Double Rich Chocolate', '6lbs', 3499.00, 20, true, 'TE-MG-DRC-6LBS'),
('550e8400-e29b-41d4-a716-446655440005', 'Double Rich Chocolate 10lbs', 'Double Rich Chocolate', '10lbs', 4999.00, 15, true, 'TE-MG-DRC-10LBS'),

-- Mass Gainer Kesar Pista variants
('550e8400-e29b-41d4-a716-446655440006', 'Kesar Pista Delight 6lbs', 'Kesar Pista Delight', '6lbs', 3499.00, 18, true, 'TE-MG-KPD-6LBS'),
('550e8400-e29b-41d4-a716-446655440007', 'Kesar Pista Delight 10lbs', 'Kesar Pista Delight', '10lbs', 4999.00, 12, true, 'TE-MG-KPD-10LBS'),

-- Lean Whey Protein variants
('550e8400-e29b-41d4-a716-446655440008', 'Double Rich Chocolate 2lbs', 'Double Rich Chocolate', '2lbs', 4999.00, 35, true, 'TE-LWP-DRC-2LBS'),
('550e8400-e29b-41d4-a716-446655440009', 'American Ice Cream 2lbs', 'American Ice Cream', '2lbs', 4999.00, 28, true, 'TE-LWP-AIC-2LBS');