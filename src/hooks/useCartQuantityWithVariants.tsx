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

  const updateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    const key = `${productId}-${variantId}`;
    setCartItems(prev => ({
      ...prev,
      [key]: newQuantity
    }));
  };

  return {
    getQuantity,
    updateQuantity,
    loading
  };
};