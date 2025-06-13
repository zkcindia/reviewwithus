import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col justify-center items-center p-6 text-center">
      {/* Success Icon */}
      <AiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />

      {/* Heading */}
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Thank You!</h1>

      {/* Subtext */}
      <p className="text-gray-700 text-base mb-6">
        We appreciate your feedback and support.
      </p>

      {/* Optional Button */}
      <a
        href="/"
        className="bg-blue-950 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-900 transition"
      >
        Back to Home
      </a>
    </div>
  );
}
