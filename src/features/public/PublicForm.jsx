import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import { useParams } from 'react-router-dom';
import { getOrganisationData, saveReview } from '../../service/api';

export default function PublicForm() {
  const [formData, setFormData] = useState({
    customer_name: "",
    contact_number: "",
    google_rating:0,
    staff_rating: 0,
    store_rating: 0,
    product_rating: 0,
    feedback: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showDetailedRatings, setShowDetailedRatings] = useState(true);
  const [organisationData, setOrganisationData] = useState(null);
  const { businessId } = useParams();
  console.log(businessId);

  useEffect(()=>{
    fetchOrganisationData();
  },[])
  // fetch organisation data
  const fetchOrganisationData = async()=>{
    try {
      const response = await getOrganisationData(businessId);
      if(response.status===200){
        setOrganisationData(response?.data || {})
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleRatingChange = (field) => (event, newRating) => {
    setFormData((prev) => ({ ...prev, [field]: newRating || 0 }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      customer_name,
      contact_number,
      staff_rating,
      store_rating,
      google_rating,
      feedback,
    } = formData;
    // Build the review message before any async code
  const fullReview = `
${google_rating}
${feedback}
  `.trim();
try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fullReview);
    } else {
      // Fallback: create a temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = fullReview;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  } catch (err) {
    console.log("Clipboard copy failed", err);
  }
    try {
      const response = await saveReview(businessId,formData)
      if(response.status===201){
        setSuccess("Thank you for your review!");
        if(formData.google_rating >= 4){ 
          setTimeout(() => {
            window.open(
              `https://search.google.com/local/writereview?placeid=${organisationData?.place_id}`,
              "_blank"
            );
          }, 1000);
        }
         // ✅ Wait a bit, then open Google Maps
        setFormData({
          customer_name: "",
          contact_number: "",
          staff_rating: 0,
          store_rating: 0,
          google_rating: 0,
          feedback: "",
        });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      {/* Left image */}
      <div className="hidden md:w-1/2 md:flex justify-center">
        <img
          src="https://img.freepik.com/free-vector/organic-flat-feedback-concept_23-2148958006.jpg?semt=ais_hybrid&w=740"
          alt="Feedback"
          className="max-w-full h-full"
        />
      </div>
      {/* Right form */}
      <div className="md:w-1/2 w-full bg-white p-10 py-6 border border-blue-100">
        <h2 className="text-xl font-bold mb-3 text-blue-950 text-center">
          Give Feedback
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          How was your experience with{" "}
          <span className="font-extrabold text-blue-950 text-md">
            {organisationData?.business_name}
          </span>
          ?
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">{success}</p>
        )}

        {/* Rating */}
        <div className="mb-6 w-full space-y-5">
          <div className="flex flex-col items-center">
            <div className="scale-125">
              <Rating
                name="google_rating"
                value={formData.google_rating}
                onChange={handleRatingChange("google_rating")}
                size="large"
                precision={1}
              />
            </div>
          </div>
          <div className="flex items-center justify-end mb-4">
            <label className="text-xs font-semibold text-blue-950 mr-4">
              {showDetailedRatings ? "Show Less Ratings" : "Show More Ratings"}
            </label>
            <button
              onClick={() => setShowDetailedRatings((prev) => !prev)}
              className={`w-8 h-4 flex items-center rounded-full p-1 transition duration-300 ease-in-out ${
                showDetailedRatings ? "bg-blue-950" : "bg-gray-400"
              }`}
            >
              <div
                className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                  showDetailedRatings ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {showDetailedRatings && (
            <div className="mb-6 w-full space-y-5">
              {/* Staff Behavior */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-blue-950 mb-1">
                  Staff Behavior
                </label>
                <div className="scale-125">
                  <Rating
                    name="staff_rating"
                    value={formData.staff_rating}
                    onChange={handleRatingChange("staff_rating")}
                    size="large"
                    precision={1}
                  />
                </div>
              </div>

              {/* Store Environment */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-blue-950 mb-1">
                  Store Environment
                </label>
                <div className="scale-125">
                  <Rating
                    name="store_rating"
                    value={formData.store_rating}
                    onChange={handleRatingChange("store_rating")}
                    size="large"
                    precision={1}
                  />
                </div>
              </div>

              {/* Product Price */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-blue-950 mb-1">
                  Product Price
                </label>
                <div className="scale-125">
                  <Rating
                    name="product_rating"
                    value={formData.product_rating}
                    onChange={handleRatingChange("product_rating")}
                    size="large"
                    precision={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Name */}
        <label className="block mb-1 text-sm font-semibold text-blue-950">
          Your Name
        </label>
        <input
          type="text"
          name="customer_name"
          value={formData.customer_name}
          onChange={handleChange}
          className="w-full p-3 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          placeholder="Enter your name"
        />

        {/* Phone */}
        <label className="block mb-1 text-sm font-semibold text-blue-950">
          Your Number
        </label>
        <input
          type="tel"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          className="w-full p-3 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          placeholder="Enter your phone number"
        />

        {/* Feedback */}
        <label className="block mb-1 text-sm font-semibold text-blue-950">
          Your Feedback
        </label>
        <textarea
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          placeholder="Write your feedback"
        />

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-950 text-white py-3 rounded-md hover:bg-blue-900 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
