
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems(data?.map(item => item.product_id) || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to wishlist.",
        variant: "destructive"
      });
      return;
    }

    const isInWishlist = wishlistItems.includes(productId);

    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;

        setWishlistItems(items => items.filter(id => id !== productId));
        toast({
          title: "Removed from Wishlist",
          description: `${productName} has been removed from your wishlist.`
        });
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert([{
            user_id: user.id,
            product_id: productId
          }]);

        if (error) throw error;

        setWishlistItems(items => [...items, productId]);
        toast({
          title: "Added to Wishlist",
          description: `${productName} has been added to your wishlist.`
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist.",
        variant: "destructive"
      });
    }
  };

  const isInWishlist = (productId: string) => wishlistItems.includes(productId);

  return {
    wishlistItems,
    loading,
    toggleWishlist,
    isInWishlist,
    refetch: fetchWishlist
  };
};
