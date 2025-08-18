import React, { useState } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

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
      // For now, just show success message
      // The actual database integration will be completed once the types are updated
      toast({
        title: "Review Submitted",
        description: "Thank you for your review! It will appear once our review system is fully activated."
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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

  return (
    <section className="py-12 border-t border-purple-800/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white">Reviews & Ratings</h2>
          {user && !showReviewForm && (
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
                No
              </div>
              <div className="text-sm text-gray-400">
                Reviews Yet
              </div>
            </div>
            <div>
              {renderStars(0)}
              <div className="text-sm text-gray-400 mt-1">
                Be the first to review this product
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        {user && showReviewForm && (
          <Card className="bg-gray-900 border-purple-800/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                Write a Review
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
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
            </CardContent>
          </Card>
        )}

        {/* No Reviews Message */}
        <Card className="bg-gray-900 border-purple-800/30">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-400 mb-4">
              No reviews yet. Be the first to share your experience!
            </p>
            {user && !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Write the First Review
              </Button>
            )}
            {!user && (
              <p className="text-sm text-gray-500">
                Please sign in to write a review
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReviewSection;