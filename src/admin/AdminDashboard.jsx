import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Qrcode from '../components/admin/Qrcode';
import { adminDashboard } from '../service/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  // const profile = {
  //   business_name: "TrendyTech Solutions",
  //   plan: "Premium",
  //   plan_expiry: "2025-12-31",
  // };
  const navigate = useNavigate();
  const [profile,setProfile] = useState({});
  const [recentReview,setRecentReview] = useState([]);

  // fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const response = await adminDashboard();
      if(response.status===200){
        setProfile(response.data);
        setRecentReview(response?.data?.recent_reviews || [])
      }}
      catch(err){
        console.log(err)
      }
  }

  useEffect(()=>{
    fetchDashboardData(); 
  },[])

  return (
    <div>
      <AdminHeader />
     <div className="p-6 max-w-6xl mx-auto">
  <h2 className="text-2xl font-bold mb-6">Welcome to Business Dashboard</h2>

  {/* Responsive Grid: md:grid-cols-2 for 2 columns on medium screens and up */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    
    {/* Left Column */}
    <div className="space-y-2">
      {/* Business Profile Card */}
      <div className="bg-blue-950 p-6 rounded-lg shadow-md flex items-center gap-4">
        <img
          src="https://filingpoint.com/images/company-registration-one-day-filingpoint-consultants-india-chennai-tn-online.jpg"
          alt="Business Logo"
          className="w-20 h-20 rounded-full border-2 border-white object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">Business Profile</h3>
          <p className="text-white"><strong>Business Name:</strong> {profile.business_name}</p>
          <p className="text-white"><strong>Subscription Plan:</strong> Rs {profile?.amount || 0}/-</p>
          <p className="text-white"><strong>Contact:</strong> {profile?.contact_number}</p>
        </div>
      </div>

      {/* Recent Reviews Table */}
      <div className="bg-blue-950 p-6 rounded-lg shadow-md text-sm">
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Reviews</h3>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-b border-white">
              <th className="py-2 text-white">Customer</th>
              <th className="text-white">Rating</th>
              <th className="text-white">Review</th>
              <th className="text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentReview.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-white">No reviews submitted yet.</td>
              </tr>
            ) : (
              recentReview.map((review, index) => (
                <tr key={index} className="border-b border-white/30 hover:bg-blue-900">
                  <td className="py-2 text-white">{review.customer_name}</td>
                  <td className="text-white">{review.rating} ⭐</td>
                  <td className="text-white">{review?.feedback.slice(0, 50)}...</td>
                  <td className="text-white">{new Date(review.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className='flex justify-end'>
          <button className='bg-white p-2 text-xs rounded-xs mt-2 cursor-pointer' onClick={()=>navigate('/admin/reviews')}>See More</button>
        </div>
      </div>
    </div>

    {/* Right Column: Qrcode component */}
    <div className="flex p- items-start">
      <Qrcode business={profile}/>
    </div>
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;
