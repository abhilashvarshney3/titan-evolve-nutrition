import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

export const useProductReviews = (productId: string) => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const loadReviewStats = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .rpc('get_product_review_stats', { product_id_param: productId });

        if (error) {
          console.error('Error loading review stats:', error);
          return;
        }

        setStats(data?.[0] || null);
      } catch (error) {
        console.error('Error loading review stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviewStats();
  }, [productId]);

  return { stats, loading };
};