import html2canvas from 'html2canvas';
import React, { useRef } from 'react';
import { BsDownload } from 'react-icons/bs';

export default function Qrcode({business}) {
  const cardRef = useRef();
  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-O1HKQgrALBmcARyIVJtWH5pDv_RwW43Y0g&s";

  const handleDownload = async () => {
    console.log('cardRef.current:', cardRef.current); // Debug log
    if (!cardRef.current) {
      console.error('cardRef is null or undefined');
      return;
    }

    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, allowTaint: false });
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${business?.business_name || 'qrcode-card'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('html2canvas error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col p-4 bg-blue-100 w-full md:w-max h-full rounded-sm">
      <div className='w-full flex justify-between p-2 pt-0'>
        <p className='text-sm font-medium'>Download QR Code</p>
        <span className='bg-white p-1 shadow-lg rounded-sm cursor-pointer hover:bg-blue-50' onClick={handleDownload}><BsDownload /></span>
      </div>
      <div className=" shadow-lg rounded-xl p-6 w-80 text-center" style={{ backgroundColor: '#ffffff' }} ref={cardRef}>
        {/* Logo */}
        <img
          src={logoUrl}
          alt="Business Logo"
          className="w-20 h-20 mx-auto mb-4 rounded-full border-2 object-cover" style={{ border: '2px solid #3B82F6' }}
        />

        {/* Business Name */}
        <h2 className="text-xl font-bold mb-1" style={{ color: '#1E3A8A' }}>{business?.business_name}</h2>

        {/* Prompt */}
        <p className="mb-2" style={{ color: '#4B5563' }}>Please leave us a review on</p>

        {/* 5 Stars */}
        <div className="flex justify-center  text-xl mb-3" style={{ color: '#FACC15' }}>
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
        <p className=" font-semibold text-sm" style={{ color: '#1D4ED8' }}>SCAN ME</p>
        <div>
          <p className='text-xs'>Powered By</p>
          <span className='text-xs font-semibold'>Write Riview Us</span>
        </div>
      </div>
    </div>
  );
}
