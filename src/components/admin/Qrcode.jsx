import React from 'react';
import { BsDownload } from 'react-icons/bs';

export default function Qrcode({business}) {
  const businessName = "TrendyTech Solutions";
  const logoUrl = "https://filingpoint.com/images/company-registration-one-day-filingpoint-consultants-india-chennai-tn-online.jpg";
  const qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://your-review-link.com";

  return (
    <div className="flex justify-center items-center flex-col p-4 bg-blue-100 w-full md:w-max h-full rounded-sm">
      <div className='w-full flex justify-between p-2 pt-0'>
        <p className='text-sm font-medium'>Download QR Code</p>
        <span className='bg-white p-1 shadow-lg rounded-sm cursor-pointer hover:bg-blue-50'><BsDownload /></span>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6 w-80 text-center">
        {/* Logo */}
        <img
          src={logoUrl}
          alt="Business Logo"
          className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-blue-500 object-cover"
        />

        {/* Business Name */}
        <h2 className="text-xl font-bold text-blue-900 mb-1">{business?.business_name}</h2>

        {/* Prompt */}
        <p className="text-gray-600 mb-2">Please leave us a review on</p>

        {/* 5 Stars */}
        <div className="flex justify-center text-yellow-500 text-xl mb-3">
          {"★★★★★".split("").map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>

        {/* QR Code */}
        <img
          src={business?.qrcode}
          alt="QR Code"
          className="mx-auto mb-2 w-36 h-36"
        />

        {/* SCAN ME Text */}
        <p className="text-blue-700 font-semibold text-sm">SCAN ME</p>
        <div>
          <p className='text-xs'>Powered By</p>
          <span className='text-xs font-semibold'>Write Riview Us</span>
        </div>
      </div>
    </div>
  );
}
