-- Add missing Titan Evolve Lean Whey Protein (American Ice Cream) product
INSERT INTO products (
  id, 
  name, 
  description, 
  price, 
  image_url, 
  category, 
  stock_quantity, 
  is_featured, 
  is_new, 
  sku,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440009',
  'Titan Evolve – Lean Whey Protein (American Ice Cream)',
  'Creamy, dessert-like experience with a vanilla-caramel blend - 25g protein per serving',
  4999,
  '/lovable-uploads/10b6d7ef-bb73-4171-bcf4-135a875bffeb.png',
  'Whey Protein',
  28,
  false,
  true,
  'TE-WP-AIC-2KG',
  now(),
  now()
);