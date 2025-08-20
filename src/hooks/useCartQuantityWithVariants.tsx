import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCartQuantityWithVariants = () => {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems({});
    }

    const handleCartUpdate = () => {
      if (user) {
        fetchCartItems();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems({});
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('product_id, variant_id, quantity')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const itemsMap: Record<string, number> = {};
      data?.forEach(item => {
        const key = `${item.product_id}-${item.variant_id}`;
        itemsMap[key] = item.quantity;
      });
      
      setCartItems(itemsMap);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems({});
    }
  };

  const getQuantity = (productId: string, variantId: string): number => {
    const key = `${productId}-${variantId}`;
    return cartItems[key] || 0;
  };

  const updateQuantity = async (productId: string, variantId: string, newQuantity: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const key = `${productId}-${variantId}`;
      
      if (newQuantity <= 0) {
        // Remove from cart
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('variant_id', variantId);
          
        if (error) throw error;
        
        setCartItems(prev => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      } else {
        // Check if item exists
        const { data: existingItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('variant_id', variantId)
          .maybeSingle();

        if (existingItem) {
          // Update existing item
          const { error } = await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id);
            
          if (error) throw error;
        } else {
          // Insert new item
          const { error } = await supabase
            .from('cart')
            .insert([{
              user_id: user.id,
              product_id: productId,
              variant_id: variantId,
              quantity: newQuantity
            }]);
            
          if (error) throw error;
        }
        
        setCartItems(prev => ({
          ...prev,
          [key]: newQuantity
        }));
      }
      
      // Trigger cart update event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update cart quantity.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    getQuantity,
    updateQuantity,
    loading
  };
};