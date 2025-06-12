import React, { useEffect, useState } from 'react';
import { allReviews } from '../service/api';
import AdminHeader from '../components/admin/AdminHeader';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [ratingSummary, setRatingSummary] = useState({
    bad: 0,
    badPlus: 0,
    good: 0,
    awesome: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await allReviews();
        setReviews(response?.data?.all_reviews || []);
        const ratingSummary = transformRatingSummary(response?.data?.rating_summary);
        setRatingSummary(ratingSummary || {})
      } catch (err) {
        setError('Failed to fetch reviews.');
      }
    };
    fetchReviews();
  }, []);
  const transformRatingSummary = (ratingData) => {
  return {
    bad: (ratingData["1"] || 0) + (ratingData["2"] || 0),
    badPlus: ratingData["3"] || 0,
    good: ratingData["4"] || 0,
    awesome: ratingData["5"] || 0,
    noRating: ratingData["0"] || 0,
  };
};


  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader />
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 text-blue-950">Submitted Reviews</h2>
         {/* Rating Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded shadow text-center">
            <p className="text-sm text-red-700 font-semibold">Bad</p>
            <h3 className="text-2xl font-bold text-red-800">{ratingSummary.bad}</h3>
          </div>
          <div className="bg-orange-100 border-l-4 border-orange-600 p-4 rounded shadow text-center">
            <p className="text-sm text-orange-700 font-semibold">Bad+</p>
            <h3 className="text-2xl font-bold text-orange-800">{ratingSummary.badPlus}</h3>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 rounded shadow text-center">
            <p className="text-sm text-yellow-700 font-semibold">Good</p>
            <h3 className="text-2xl font-bold text-yellow-800">{ratingSummary.good}</h3>
          </div>
          <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded shadow text-center">
            <p className="text-sm text-green-700 font-semibold">Awesome</p>
            <h3 className="text-2xl font-bold text-green-800">{ratingSummary.awesome}</h3>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        {reviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-950 border border-blue-950 text-xs sm:text-sm">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left">Name</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Contact</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Google Rating</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Staff Behavior</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Store Environment</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Product Price</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Feedback</th>
                  <th className="px-2 sm:px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReviews.map((review, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                  >
                    <td className="px-2 sm:px-4 py-2">{review.customer_name}</td>
                    <td className="px-2 sm:px-4 py-2">{review.contact_number}</td>
                    <td className="px-2 sm:px-4 py-2">{review.google_rating || 'N/A'} ⭐</td>
                    <td className="px-2 sm:px-4 py-2">{review.staff_rating || 'N/A'} ⭐</td>
                    <td className="px-2 sm:px-4 py-2">{review.store_rating || 'N/A'} ⭐</td>
                    <td className="px-2 sm:px-4 py-2">{review.product_rating || 'N/A'} ⭐</td>
                    <td className="px-2 sm:px-4 py-2">{review.feedback}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-600 text-[10px] sm:text-xs">
                      {new Date(review.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-950 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-1 sm:py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-950 text-white'
                      : 'bg-gray-200 text-blue-950'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-950 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
