import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
  is_verified_purchase: boolean | null;
  is_approved: boolean | null;
  helpful_count: number | null;
  first_name: string | null;
  last_name: string | null;
}

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      // Load all approved reviews for this product using RPC
      const { data: reviewsData, error } = await supabase.rpc('get_reviews', {
        product_id_param: productId
      });

      if (error) throw error;

      const reviews = reviewsData as Review[];
      setReviews(reviews || []);
      setTotalReviews(reviews?.length || 0);
      
      // Calculate average rating
      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        setAverageRating(Math.round(avgRating * 10) / 10);
      } else {
        setAverageRating(0);
      }

      // Check if current user has already reviewed this product
      if (user) {
        const userReviewData = reviews?.find(review => review.user_id === user.id);
        setUserReview(userReviewData || null);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to write a review.",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating and comment.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && userReview) {
        // Update existing review using RPC
        const { error } = await supabase.rpc('update_review', {
          review_id: userReview.id,
          new_rating: rating,
          new_title: title.trim() || null,
          new_comment: comment.trim()
        });

        if (error) throw error;

        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully."
        });
      } else {
        // Create new review using RPC
        const { error } = await supabase.rpc('create_review', {
          user_id_param: user.id,
          product_id_param: productId,
          rating_param: rating,
          title_param: title.trim() || null,
          comment_param: comment.trim()
        });

        if (error) throw error;

        toast({
          title: "Review Submitted",
          description: "Thank you for your review!"
        });
      }

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setShowReviewForm(false);
      setIsEditing(false);
      
      // Reload reviews
      loadReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to submit review.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = () => {
    if (userReview) {
      setRating(userReview.rating);
      setTitle(userReview.title || '');
      setComment(userReview.comment);
      setIsEditing(true);
      setShowReviewForm(true);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase.rpc('delete_review', {
        review_id: userReview.id
      });

      if (error) throw error;

      toast({
        title: "Review Deleted",
        description: "Your review has been deleted."
      });

      loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-600'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-12 border-t border-purple-800/30">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-t border-purple-800/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">Reviews & Ratings</h2>
          {user && !userReview && !showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {averageRating || 'No'}
              </div>
              <div className="text-sm text-gray-400">
                {totalReviews > 0 ? 'Average Rating' : 'Reviews Yet'}
              </div>
            </div>
            <div>
              {renderStars(Math.round(averageRating))}
              <div className="text-sm text-gray-400 mt-1">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* User's Review or Review Form */}
        {user && (userReview || showReviewForm) && (
          <Card className="bg-gray-900 border-purple-800/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {isEditing ? 'Edit Your Review' : userReview ? 'Your Review' : 'Write a Review'}
                {userReview && !showReviewForm && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditReview}
                      className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteReview}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showReviewForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating *
                    </label>
                    {renderStars(rating, true, setRating)}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title (Optional)
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Summarize your review..."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Comment *
                    </label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submitting || rating === 0 || !comment.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {submitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false);
                        setIsEditing(false);
                        setRating(0);
                        setTitle('');
                        setComment('');
                      }}
                      className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : userReview ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {renderStars(userReview.rating)}
                    <span className="text-sm text-gray-400">
                      {new Date(userReview.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {userReview.title && (
                    <h4 className="font-semibold text-white">{userReview.title}</h4>
                  )}
                  <p className="text-gray-300">{userReview.comment}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* All Reviews */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="bg-gray-900 border-purple-800/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        {review.is_verified_purchase && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-white">
                        {review.first_name && review.last_name
                          ? `${review.first_name} ${review.last_name.charAt(0)}.`
                          : 'Anonymous User'}
                      </p>
                    </div>
                  </div>
                  
                  {review.title && (
                    <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-gray-300 mb-3">{review.comment}</p>
                  
                  {review.helpful_count && review.helpful_count > 0 && (
                    <div className="text-sm text-gray-400">
                      {review.helpful_count} people found this helpful
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-900 border-purple-800/30">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-400">
                  No reviews yet. Be the first to share your experience!
                </p>
                {user && (
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Write the First Review
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;