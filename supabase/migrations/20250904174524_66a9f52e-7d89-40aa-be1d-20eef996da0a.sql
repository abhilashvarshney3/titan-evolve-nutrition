-- Add missing INSERT policy for order_items table
CREATE POLICY "Users can create order items for their own orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

-- Add policy for edge functions to insert order items
CREATE POLICY "Edge functions can manage order items" 
ON public.order_items 
FOR ALL 
USING (true)
WITH CHECK (true);