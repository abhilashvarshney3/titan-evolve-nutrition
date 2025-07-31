import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCartQuantity = (productId: string) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && productId) {
      fetchQuantity();
    } else {
      setQuantity(0);
    }

    // Listen for cart updates
    const handleCartUpdate = () => {
      if (user && productId) {
        fetchQuantity();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user, productId]);

  const fetchQuantity = async () => {
    if (!user || !productId) {
      setQuantity(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      
      setQuantity(data?.quantity || 0);
    } catch (error) {
      console.error('Error fetching cart quantity:', error);
      setQuantity(0);
    }
  };

  const updateQuantity = async (newQuantity: number, productName: string) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to manage cart items.",
        variant: "destructive"
      });
      return;
    }

    if (newQuantity < 0) return;

    setLoading(true);
    try {
      if (newQuantity === 0) {
        // Remove item from cart
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        
        toast({
          title: "Removed from Cart",
          description: `${productName} has been removed from your cart.`
        });
      } else {
        // Check if item exists in cart
        const { data: existingItem } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .maybeSingle();

        if (existingItem) {
          // Update existing item
          const { error } = await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id);

          if (error) throw error;
        } else {
          // Add new item
          const { error } = await supabase
            .from('cart')
            .insert([
              {
                user_id: user.id,
                product_id: productId,
                quantity: newQuantity
              }
            ]);

          if (error) throw error;
          
          toast({
            title: "Added to Cart",
            description: `${productName} has been added to your cart.`
          });
        }
      }

      setQuantity(newQuantity);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update cart.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = (productName: string) => {
    updateQuantity(quantity + 1, productName);
  };

  const decrementQuantity = (productName: string) => {
    updateQuantity(quantity - 1, productName);
  };

  const addToCart = (productName: string) => {
    updateQuantity(1, productName);
  };

  return {
    quantity,
    loading,
    incrementQuantity,
    decrementQuantity,
    addToCart,
    updateQuantity
  };
};