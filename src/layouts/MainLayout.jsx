import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* You can add a header here if needed */}
      <main className="flex-grow">
        <Outlet /> {/* renders the current route content */}
      </main>
      <Footer /> {/* persistent footer */}
    </div>
  );
};

export default MainLayout;
