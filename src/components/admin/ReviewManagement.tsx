import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Check, X, Eye, Trash2, Star } from 'lucide-react';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  first_name: string;
  last_name: string;
  product_name: string;
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_all_reviews');

      if (error) {
        console.error('Error loading reviews:', error);
        throw error;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase.rpc('admin_update_review_status', {
        review_id: reviewId,
        is_approved_param: !isApproved
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review ${!isApproved ? 'approved' : 'unapproved'} successfully`
      });

      // Reload reviews
      loadReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Review deleted successfully"
      });

      // Reload reviews
      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-600 text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-2 text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-400">REVIEW MANAGEMENT</h2>
        <div className="text-sm text-gray-400">
          Total Reviews: {reviews.length} | Approved: {reviews.filter(r => r.is_approved).length} | Pending: {reviews.filter(r => !r.is_approved).length}
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="py-8 text-center">
            <p className="text-gray-400">No reviews found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg text-white">{review.product_name}</CardTitle>
                      <Badge
                        variant={review.is_approved ? "default" : "destructive"}
                        className={review.is_approved ? "bg-green-600" : "bg-red-600"}
                      >
                        {review.is_approved ? "Approved" : "Pending"}
                      </Badge>
                      {review.is_verified_purchase && (
                        <Badge variant="outline" className="border-blue-400 text-blue-400">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-400">
                        by {review.first_name} {review.last_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={review.is_approved ? "destructive" : "default"}
                      onClick={() => handleApprovalToggle(review.id, review.is_approved)}
                      className={review.is_approved ? "" : "bg-green-600 hover:bg-green-700"}
                    >
                      {review.is_approved ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Unapprove
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-white font-medium">{review.title}</h4>
                  </div>
                  <div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Helpful count: {review.helpful_count}</span>
                    <span>Review ID: {review.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;