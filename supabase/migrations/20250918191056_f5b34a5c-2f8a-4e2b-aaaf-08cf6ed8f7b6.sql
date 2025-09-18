-- Add support for guest orders by making user_id nullable and adding guest customer details
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Add guest customer information columns to orders table
ALTER TABLE public.orders ADD COLUMN guest_email TEXT;
ALTER TABLE public.orders ADD COLUMN guest_phone TEXT;
ALTER TABLE public.orders ADD COLUMN guest_first_name TEXT;
ALTER TABLE public.orders ADD COLUMN guest_last_name TEXT;
ALTER TABLE public.orders ADD COLUMN is_guest_order BOOLEAN DEFAULT FALSE;

-- Update orders table constraint to ensure either user_id exists OR guest details exist
ALTER TABLE public.orders ADD CONSTRAINT check_order_customer 
CHECK (
  (user_id IS NOT NULL AND is_guest_order = FALSE) OR 
  (user_id IS NULL AND is_guest_order = TRUE AND guest_email IS NOT NULL AND guest_phone IS NOT NULL AND guest_first_name IS NOT NULL AND guest_last_name IS NOT NULL)
);

-- Update RLS policies to allow guest orders
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- New policy for creating orders (both authenticated and guest)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id AND is_guest_order = FALSE) OR 
  (auth.uid() IS NULL AND is_guest_order = TRUE)
);

-- New policy for viewing orders (both authenticated and guest)
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() = user_id AND is_guest_order = FALSE) OR
  (is_guest_order = TRUE)
);

-- Update order_items policies to allow guest orders
DROP POLICY IF EXISTS "Users can create order items for their own orders" ON public.order_items;

CREATE POLICY "Anyone can create order items for valid orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id AND 
    (
      (orders.user_id = auth.uid() AND orders.is_guest_order = FALSE) OR 
      orders.is_guest_order = TRUE
    )
  )
);

-- Update order_items view policy for guest orders
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

CREATE POLICY "Users can view accessible order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id AND 
    (
      (orders.user_id = auth.uid() AND orders.is_guest_order = FALSE) OR 
      orders.is_guest_order = TRUE
    )
  )
);