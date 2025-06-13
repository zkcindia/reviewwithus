import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaStar, FaUser } from 'react-icons/fa';

const AdminHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !(dropdownRef.current).contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-xl cursor-pointer" onClick={()=>navigate('/admin')}>Business Panel</div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          <FaUserCircle />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-blue-950 hover:bg-blue-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaTachometerAlt className="mr-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/reviews"
              className="flex items-center px-4 py-2 text-blue-950 hover:bg-blue-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaStar className="mr-2" />
              Reviews
            </Link>
            <Link
    to="/admin/profile"
    className="flex items-center px-4 py-2 text-blue-950 hover:bg-blue-100"
    onClick={() => setIsDropdownOpen(false)}
  >
    <FaUser className="mr-2" />
    Profile
  </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
