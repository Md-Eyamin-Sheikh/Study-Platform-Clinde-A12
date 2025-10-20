import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import Swal from 'sweetalert2';

const BookedSessionDetail = ({ session, onBack }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/reviews/${session.studySessionId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('https://study-hub-survar-a12.vercel.app/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          
          studySessionId: session.studySessionId,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
        Swal.fire('Success!', 'Review submitted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire('Error!', 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const sessionDetails = session.sessionDetails;

  return (
    <div className='bg-green-100 min-h-screen py-8'>
      <div className='bg-green-100 max-w-7xl mx-auto p-6'>
      <button
        onClick={onBack}
        className="flex items-center text-gray-900 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Booked Sessions
      </button>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {sessionDetails?.title || session.sessionTitle}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Session Information</h3>
            <p className="text-gray-600 mb-1">Tutor: {session.tutorEmail}</p>
            <p className="text-gray-600 mb-1">
              Fee: {session.registrationFee === 0 ? 'Free' : `$${session.registrationFee}`}
            </p>
            <p className="text-gray-600 mb-1">
              Booked: {new Date(session.bookedAt).toLocaleDateString()}
            </p>
          </div>
          
          {sessionDetails && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Session Details</h3>
              <p className="text-gray-900 mb-1">Duration: {sessionDetails.sessionDuration}</p>
              <p className="text-gray-900 mb-1">Location: {sessionDetails.location}</p>
              <p className="text-gray-900 mb-1">Level: {sessionDetails.level}</p>
            </div>
          )}
        </div>

        {sessionDetails?.description && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-900">{sessionDetails.description}</p>
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews & Ratings</h3>
        
        {/* Submit Review Form */}
        <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Write a Review</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="3"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Display Reviews */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-1">By: {review.studentEmail}</p>
              </div>
            ))
          )}
        </div>
      </div>
      </div>

    </div>
    
  );
};

export default BookedSessionDetail;
