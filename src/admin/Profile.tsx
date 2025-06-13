import React, { useRef, useState } from 'react';
import { FaUserEdit, FaGlobe, FaUpload } from 'react-icons/fa';
import AdminHeader from '../components/admin/AdminHeader';

export default function Profile() {
  const [logo, setLogo] = useState(
    'https://filingpoint.com/images/company-registration-one-day-filingpoint-consultants-india-chennai-tn-online.jpg'
  );

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const business = {
    name: 'Boxin Technologies Pvt Ltd',
    email: 'info@boxin.com',
    phone: '+91 9876543210',
    website: 'https://www.boxin.com',
  };

  return (
    <>
      <AdminHeader />
      <div className="h-full min-h-[calc(100vh-140px)] bg-blue-50 flex items-center justify-center p-4">
        <div className=" rounded-xs bg-white w-full h-full max-w-md p-6 text-center sm:text-left">
          {/* Business Logo */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <div className="relative">
              <img
                src={logo}
                alt="Business Logo"
                className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover mx-auto sm:mx-0"
              />
              <button
                className="absolute bottom-0 right-0 p-1 bg-white border border-blue-300 rounded-full shadow hover:bg-blue-100"
                onClick={handleEditClick}
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
              <h2 className="text-2xl font-semibold text-blue-900">{business.name}</h2>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1 justify-center md:justify-start"
              >
                <FaGlobe />
                {business.website}
              </a>
            </div>
          </div>

          {/* Business Details */}
          <div className="mt-6 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">{business.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="text-base font-medium text-gray-800">{business.phone}</p>
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
