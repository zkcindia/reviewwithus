import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import PublicForm from '../features/public/PublicForm';
// import ThankYou from '../features/public/ThankYou';
// import AdminLogin from '../features/auth/AdminLogin';
import AdminRegister from '../auth/AdminRegister';
import MainLayout from '../layouts/MainLayout';
import AdminDashboard from '../admin/AdminDashboard';
import PublicForm from '../features/public/PublicForm';
import ReviewList from '../admin/ReviewList';
// import AdminDashboard from '../features/admin/AdminDashboard';
// import ReviewList from '../features/admin/ReviewList';

// Optional: Auth protection
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
//   return token ? children : <Navigate to="/login" />;
return token ? children : <Navigate to="/register" />;
};

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return (
    <Routes>
       {/* ✅ Only redirect if path is exactly "/" */}
      <Route index element={<Navigate to={isAuthenticated ? "/admin" : "/register"} />} />

      {/* ✅ Wrap all pages in MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
       <Route path="rateus/:businessId" element={<PublicForm />} />

        <Route path="register" element={<AdminRegister />} />
      {/* <Route path="/thankyou" element={<ThankYou />} /> */}
      {/* <Route path="/login" element={<AdminLogin />} /> */}

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <PrivateRoute>
            <ReviewList />
          </PrivateRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
