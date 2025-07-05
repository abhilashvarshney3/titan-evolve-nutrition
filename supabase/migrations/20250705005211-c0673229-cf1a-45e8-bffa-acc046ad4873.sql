
-- First, let's add some real products to the database with proper UUIDs and INR pricing
INSERT INTO public.products (id, name, description, price, image_url, category_id, stock_quantity, is_featured, is_new) VALUES
(gen_random_uuid(), 'MURDERER Pre-Workout', 'Hard hitting pre-workout with hardcore pump and laser focus. Engineered for elite athletes who demand maximum performance.', 4999.00, '/lovable-uploads/07c966c6-c74a-41cd-bdf1-b37a79c15e05.png', NULL, 100, true, false),
(gen_random_uuid(), 'LEAN WHEY Protein', 'Ultra micro filtered whey with 24g protein and fast absorption. Perfect for lean muscle development and recovery.', 3999.00, '/lovable-uploads/ab7a6da8-9536-4097-8873-2667208ceef8.png', NULL, 150, true, false),
(gen_random_uuid(), 'LEAN WHEY Premium', 'Premium whey protein for lean muscle development with enhanced absorption technology.', 4499.00, '/lovable-uploads/746318e4-45e9-471f-a51f-473b614f8266.png', NULL, 120, false, true),
(gen_random_uuid(), 'LEAN WHEY Elite', 'Elite formula for maximum muscle recovery with ultra-filtered whey protein.', 4999.00, '/lovable-uploads/729e363e-5733-4ed4-a128-36142849c19e.png', NULL, 80, true, false);

-- Add some categories for better organization
INSERT INTO public.categories (id, name, description) VALUES
(gen_random_uuid(), 'Pre-Workout', 'Energy boosting supplements for maximum performance'),
(gen_random_uuid(), 'Protein', 'High-quality protein supplements for muscle building'),
(gen_random_uuid(), 'Mass Gainer', 'High-calorie formulas for serious size gains'),
(gen_random_uuid(), 'Fat Loss', 'Thermogenic compounds for cutting cycles'),
(gen_random_uuid(), 'Creatine', 'Pure creatine supplements for strength and power'),
(gen_random_uuid(), 'Recovery', 'Post-workout recovery supplements'),
(gen_random_uuid(), 'Vitamins', 'Essential vitamins and minerals');

-- Update the cart table to ensure proper foreign key relationship with products
ALTER TABLE public.cart 
ADD CONSTRAINT cart_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
