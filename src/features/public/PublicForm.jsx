import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrganisationData, saveReview, generateContent } from '../../service/api';

export default function PublicForm() {
  const [formData, setFormData] = useState({
    customer_name: "",
    contact_number: "",
    google_rating: 0,
    staff_rating: 0,
    store_rating: 0,
    product_rating: 0,
    feedback: "",
  });

  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showDetailedRatings, setShowDetailedRatings] = useState(true);
  const [organisationData, setOrganisationData] = useState(null);
  const { businessId } = useParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate AI review from feedback
  const generateAIReview = async () => {
    // Check for missing fields
    const missingFields = [];
    
    if (!formData.customer_name || formData.customer_name.trim().length < 2) {
      missingFields.push("Name");
    }
    
    if (!formData.contact_number || formData.contact_number.trim().length < 5) {
      missingFields.push("Phone Number");
    }
    
    if (!formData.feedback || formData.feedback.trim().length < 3) {
      missingFields.push("Feedback");
    }

    // If any fields are missing, show alert
    if (missingFields.length > 0) {
      const message = `⚠️ Please fill in the following required field${missingFields.length > 1 ? 's' : ''}:\n\n${missingFields.map(f => `• ${f}`).join('\n')}`;
      alert(message);
      return;
    }

    // All fields are filled, proceed with generation
    setIsGenerating(true);
    setError("");
    setSuccess("");

    try {
      const rating = formData.google_rating || 0;
      const businessName = organisationData?.business_name || "our store";
      const vibe = rating >= 4 ? "positive" : rating >= 3 ? "neutral" : "mixed";
      const userFeedback = formData.feedback;
      const staffRating = formData.staff_rating || 0;
      const storeRating = formData.store_rating || 0;
      const productRating = formData.product_rating || 0;

      const prompt = `Write a detailed Google review for ${businessName} based on user feedback: "${userFeedback}".
      Overall rating: ${rating}/5 stars (${vibe} experience).
      Staff rating: ${staffRating}/5, Store rating: ${storeRating}/5, Product rating: ${productRating}/5.
      
      Make it 50-80 words, natural, and include specific details.
      Write only the review, no extra text.`;

      const response = await generateContent(prompt);
      
      if (response && response.status === 200 && response.data?.content) {
        const aiReview = response.data.content;
        setGeneratedReview(aiReview);
        
        // IMPORTANT: Update formData with AI-generated review
        setFormData(prev => ({
          ...prev,
          feedback: aiReview
        }));
        
        setShowReviewModal(true);
        setSuccess("✨ AI-generated review ready!");
        setIsGenerating(false);
      } else {
        setError("Failed to generate review. Please try again.");
        setIsGenerating(false);
      }
    } catch (err) {
      console.error("Review Generation Error:", err);
      setError("Failed to generate review. Please try again.");
      setIsGenerating(false);
    }
  };

  // Save review, copy to clipboard AND go to Google
  const copyAndGoToGoogle = async () => {
    setIsSaving(true);
    
    try {
      // IMPORTANT: Use formData which now has the AI-generated review
      const saveData = {
        ...formData,
        feedback: generatedReview // Ensure AI review is saved
      };
      
      // 1. Save review to database with AI-generated review
      const saveResponse = await saveReview(businessId, saveData);
      console.log("Review saved with AI content:", saveData);
      
      if (saveResponse.status === 201 || saveResponse.status === 200) {
        setSuccess("✅ Review saved successfully!");
      }
      
      // 2. Copy to clipboard
      try {
        await navigator.clipboard.writeText(generatedReview);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        // Fallback copy
        const textArea = document.createElement("textarea");
        textArea.value = generatedReview;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
      
      // 3. Open Google review page after delay
      setTimeout(() => {
        const rating = formData.google_rating || 0;
        const placeId = organisationData?.place_id;
        
        if (placeId && rating >= 4) {
          window.open(
            `https://search.google.com/local/writereview?placeid=${placeId}`,
            "_blank"
          );
        } else {
          const businessName = organisationData?.business_name || "store";
          window.open(
            `https://www.google.com/search?q=${encodeURIComponent(businessName + ' review')}`,
            "_blank"
          );
        }
      }, 500);
      
    } catch (err) {
      console.error("Error in copyAndGoToGoogle:", err);
      setError("Failed to save review. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
    try {
      const response = await saveReview(businessId, formData);
      if (response.status === 201) {
        navigate('/thankyou');
      }
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  useEffect(() => {
    const fetchOrganisationData = async () => {
      try {
        const response = await getOrganisationData(businessId);
        if (response.status === 200) setOrganisationData(response?.data || {});
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrganisationData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen">
      <div className="hidden md:w-1/2 md:flex justify-center">
        <img
          src="https://img.freepik.com/free-vector/organic-flat-feedback-concept_23-2148958006.jpg?semt=ais_hybrid&w=740"
          alt="Feedback"
          className="max-w-full h-full object-cover"
        />
      </div>
      
      <div className="md:w-1/2 w-full bg-white p-10 py-6 border border-blue-100 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-3 text-blue-950 text-center">Give Feedback</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          How was your experience with{" "}
          <span className="font-extrabold text-blue-950 text-md">
            {organisationData?.business_name}
          </span>
          ?
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        {/* Ratings */}
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
              {[
                { name: "staff_rating", label: "Staff Behavior" },
                { name: "store_rating", label: "Store Environment" },
                { name: "product_rating", label: "Product Price" }
              ].map(({ name, label }) => (
                <div key={name} className="flex flex-col items-center">
                  <label className="text-sm font-semibold text-blue-950 mb-1">{label}</label>
                  <div className="scale-125">
                    <Rating
                      name={name}
                      value={formData[name]}
                      onChange={handleRatingChange(name)}
                      size="large"
                      precision={1}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Name */}
        <label className="block mb-1 text-sm font-semibold text-blue-950">
          Your Name <span className="text-red-500">*</span>
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
          Your Number <span className="text-red-500">*</span>
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
          Your Feedback <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="Type your feedback (e.g., 'nice product', 'great service')"
          />
        </div>
        <p className="text-xs text-gray-400 mb-6">
          {formData.feedback?.length || 0} characters
        </p>

        {/* Generate Button */}
        <button
          type="button"
          onClick={generateAIReview}
          disabled={isGenerating}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            isGenerating
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-blue-950 hover:bg-blue-900 text-white'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Review...
            </span>
          ) : (
            '✨ Generate Review'
          )}
        </button>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-950">Your AI-Generated Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {generatedReview}
                </p>
              </div>

              <button
                onClick={copyAndGoToGoogle}
                disabled={isSaving}
                className={`w-full py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                  isSaving
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-blue-950 hover:bg-blue-900 text-white'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving & Opening...
                  </>
                ) : copied ? (
                  <>
                    <span>✅ Copied!</span>
                    <span>🚀 Opening Google...</span>
                  </>
                ) : (
                  <>
                    <span>📋 Copy & Go to Google Review</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                💡 Click the button above to save your review, copy it, and open Google review page in one click
              </p>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Then simply paste (Ctrl+V) and submit your review on Google
              </p>

              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-blue-950 transition-colors border-t border-gray-200 pt-4"
              >
                Save Review to Dashboard (Optional)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}