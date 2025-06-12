import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-white text-center py-3">
      <p className="text-sm">&copy; {new Date().getFullYear()} WriteReviewUs. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
