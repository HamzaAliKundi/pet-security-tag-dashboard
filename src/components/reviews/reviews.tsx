import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useSubmitReviewMutation, useGetMyReviewQuery } from '../../apis/reviews';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [submitReview, { isLoading }] = useSubmitReviewMutation();
  const { data: myReviewData, isLoading: isLoadingReview } = useGetMyReviewQuery();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [hasExistingReview, setHasExistingReview] = useState(false);

  // Load existing review if available
  useEffect(() => {
    if (myReviewData?.review) {
      setRating(myReviewData.review.rating);
      setFormData({
        title: myReviewData.review.title,
        description: myReviewData.review.description
      });
      setHasExistingReview(true);
    }
  }, [myReviewData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await submitReview({
        ...formData,
        rating
      }).unwrap();

      toast.success(response.message || 'Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setFormData({
        title: '',
        description: ''
      });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoadingReview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CB2E2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasExistingReview ? 'Update Your Review' : 'Leave a Review'}
          </h1>
          <p className="text-gray-600">
            {hasExistingReview 
              ? 'Edit your existing review below'
              : 'Share your experience with Digital Tails'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    fill={(hoverRating || rating) >= star ? '#FFD700' : 'none'}
                    stroke={(hoverRating || rating) >= star ? '#FFD700' : '#D1D5DB'}
                    strokeWidth={2}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold text-gray-700">
                {rating > 0 ? `${rating} / 5` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Summarize your experience"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CB2E2] focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your experience with Digital Tails..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CB2E2] focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#4CB2E2] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3da1d1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (hasExistingReview ? 'Updating...' : 'Submitting...') 
                : (hasExistingReview ? 'Update Review' : 'Submit Review')
              }
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your review will be visible immediately on our website. You can update it anytime by returning to this page.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reviews;

