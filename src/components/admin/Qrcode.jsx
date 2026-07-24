import html2canvas from 'html2canvas';
import React, { useRef, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

export default function Qrcode({business}) {
  const cardRef = useRef();
  const logoUrl = "/demo.jpg";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    console.log('cardRef.current:', cardRef.current);
    if (!cardRef.current) {
      console.error('cardRef is null or undefined');
      return;
    }

    setIsDownloading(true);

    try {
      // Wait for all images to load
      const images = cardRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the original element dimensions
      const element = cardRef.current;
      const originalWidth = element.offsetWidth || 320;
      const originalHeight = element.offsetHeight || 400;

      // Scale factor for 4K resolution
      const scale = 6; // 6x scaling for 4K quality
      
      console.log(`Rendering at ${originalWidth * scale}x${originalHeight * scale} (4K scale: ${scale}x)`);

      // Render with 4K resolution
      const canvas = await html2canvas(element, {
        scale: scale, // 6x scaling for 4K quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (document) => {
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      // Convert to high quality PNG
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${business?.business_name || 'qrcode-card'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('4K QR code downloaded successfully!');

    } catch (error) {
      console.error('html2canvas error:', error);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col p-4 bg-blue-100 w-full md:w-max h-full rounded-sm">
      <div className="w-full flex justify-between p-2 pt-0">
        <p className="text-sm font-medium">Download QR Code</p>
        {
          business.profile_image && (
            <span
              className="bg-white p-1 shadow-lg rounded-sm cursor-pointer hover:bg-blue-50"
              onClick={handleDownload}
              style={{ opacity: isDownloading ? 0.5 : 1 }}
            >
              {/* {isDownloading ? '⏳' : <BsDownload />} */}

              <BsDownload />
            </span>
          )
        }
      </div>
      <div
        className="shadow-lg rounded-xl p-6 w-80 text-center relative overflow-hidden"
        style={{ backgroundColor: "#ffffff" }}
        ref={cardRef}
      >
        {
          !business.profile_image && (
            <div className="w-full h-full absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm flex items-center justify-center">
              <p className="text-sm text-blue-950 text-center text-wrap px-10">
                To download QR, upload your business logo first in the profile menu.
              </p>
            </div>
          )
        }

        {/* Logo */}
        <img
          src={`${business?.profile_image || logoUrl}`}
          alt="Business Logo"
          className="w-24 h-24 mx-auto mb-4 rounded-full border-2 object-cover"
          style={{ border: "2px solid #3B82F6" }}
          crossOrigin="anonymous"
        />

        {/* Business Name */}
        <h2 className="text-xl font-bold mb-1" style={{ color: "#1E3A8A" }}>
          {business?.business_name}
        </h2>

        {/* Prompt */}
        <p className="mb-2" style={{ color: "#4B5563" }}>
          Please leave us a review on
        </p>

        {/* 5 Stars */}
        <div
          className="flex justify-center text-xl mb-3"
          style={{ color: "#FACC15" }}
        >
          {"★★★★★".split("").map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>

        {/* QR Code */}
        <img
          src={business?.qrcode}
          alt="QR Code"
          className="mx-auto mb-2 w-36 h-36"
          crossOrigin="anonymous"
        />

        {/* SCAN ME Text */}
        <p className="font-semibold text-sm" style={{ color: "#1D4ED8" }}>
          SCAN ME
        </p>
        <div>
          <p className="text-xs">Powered By</p>
          <span className="text-xs font-semibold">Review With Us</span>
        </div>
      </div>
    </div>
  );
}