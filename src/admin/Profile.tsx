import React, { useEffect, useRef, useState } from 'react';
import { FaUserEdit, FaGlobe, FaUpload } from 'react-icons/fa';
import AdminHeader from '../components/admin/AdminHeader';
import { adminDashboard, editProfile } from '../service/api';
import Loading from '../components/common/Loading';

export default function Profile() {
  const [logo, setLogo] = useState(
    'https://filingpoint.com/images/company-registration-one-day-filingpoint-consultants-india-chennai-tn-online.jpg'
  );
  const [logoFile, setLogoFile] = useState(null);
  const [profileData,setProfileData] = useState(null)
  const [loading, setLoading] = useState(true); 

  const fileInputRef = useRef(null);
  useEffect(()=>{
    fetchDashboardData();
  },[])

  // fetch Dashboard Data
    const fetchDashboardData = async () => {
      try {
        const response = await adminDashboard();
        if(response.status===200){
          setProfileData(response.data);
        }}
        catch(err){
          console.log(err)
        }finally{
          setLoading(false);
        }
    }

 const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result); // for preview
    reader.readAsDataURL(file);
    setLogoFile(file); // for upload
  }
};


 const handleEditClick = async () => {
  fileInputRef.current.click();
};

const handleUpload = async () => {
  if (!logoFile) return;

  try {
    const formData = new FormData();
    formData.append('profile_image', logoFile); // ✅ use File, not base64 string

    const response = await editProfile(formData);
    if (response.status === 200) {
      fetchDashboardData();
    }
  } catch (error) {
    console.log(error);
  }
};
if (loading) return <Loading />;

  return (
    <>
      <AdminHeader />
      <div className="h-full min-h-[calc(100vh-140px)] bg-blue-50 flex items-center justify-center p-4">
        <div className=" rounded-xs bg-white w-full h-full max-w-md p-6 text-center sm:text-left">
          {/* Business Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div className="relative">
              <img
                src={profileData?.profile_image?profileData?.profile_image:logo}
                alt="Business Logo"
                className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover mx-auto sm:mx-0"
              />
              <button
                className="absolute bottom-0 right-0 p-1 bg-white border border-blue-300 rounded-full shadow hover:bg-blue-100"
                onClick={handleUpload}
                title="Change Logo"
              >
                <FaUpload className="text-blue-600 text-sm" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <div className="mt-4 sm:mt-0">
              <h2 className="text-2xl font-semibold text-blue-900">{profileData?.business_name}</h2>
              <a
  href={profileData?.business_link}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1 justify-center md:justify-start overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]" // Adjust max-w as needed
>
  <FaGlobe className="flex-shrink-0" />
  <span className="truncate">{profileData?.business_link}</span>
</a>

            </div>
          </div>

          {/* Business Details */}
          <div className="mt-6 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">{profileData?.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="text-base font-medium text-gray-800">{profileData?.contact_number}</p>
            </div>
          </div>

          {/* Edit Logo Button */}
          <button
            className="mt-6 w-full flex justify-center items-center gap-2 bg-blue-950 text-white py-2 rounded-md hover:bg-blue-900 transition"
            onClick={handleEditClick}
          >
            <FaUserEdit />
            Upload New Logo
          </button>
        </div>
      </div>
    </>
  );
}
