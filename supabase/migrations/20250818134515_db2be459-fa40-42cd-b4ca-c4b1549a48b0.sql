-- Add the missing American Ice Cream protein product
INSERT INTO products (
  id, 
  name, 
  description, 
  price, 
  category_id, 
  stock_quantity, 
  is_featured, 
  is_new, 
  sku, 
  image_url
) VALUES (
  '550e8400-e29b-41d4-a716-446655440009',
  'Titan Evolve – Lean Whey Protein (American Ice Cream)',
  'Creamy, dessert-like experience with a vanilla-caramel blend - 25g protein per serving',
  4999,
  '550e8400-e29b-41d4-a716-446655440104',
  28,
  false,
  true,
  'TE-WP-AIC-2KG',
  '/lovable-uploads/10b6d7ef-bb73-4171-bcf4-135a875bffeb.png'
);

-- Update Mass Gainer products to use lbs instead of kg and update prices
UPDATE products 
SET 
  name = 'Titan Evolve – Mass Gainer (Double Rich Chocolate) 6lbs',
  price = 3499,
  sku = 'TE-MG-DRC-6LBS'
WHERE id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE products 
SET 
  name = 'Titan Evolve – Mass Gainer (Double Rich Chocolate) 10lbs',
  price = 4999,
  sku = 'TE-MG-DRC-10LBS'
WHERE id = '550e8400-e29b-41d4-a716-446655440005';

UPDATE products 
SET 
  name = 'Titan Evolve – Mass Gainer (Kesar Pista Delight) 6lbs',
  price = 3499,
  sku = 'TE-MG-KPD-6LBS'
WHERE id = '550e8400-e29b-41d4-a716-446655440006';

UPDATE products 
SET 
  name = 'Titan Evolve – Mass Gainer (Kesar Pista Delight) 10lbs',
  price = 4999,
  sku = 'TE-MG-KPD-10LBS'
WHERE id = '550e8400-e29b-41d4-a716-446655440007';