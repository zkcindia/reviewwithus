import React, { useState } from 'react';
import { loginUser } from '../service/api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({setShowSignin}) {
  const [userName,setUserName] = useState('');
  const [password,setPassword] = useState('');
   const navigate = useNavigate();

  // handel login
  const handleLogin = async(e)=>{
    e.preventDefault(); 
    try {
      const data = {email:userName,contact_number:password}
      const response = await loginUser(data);
      if(response.status===200){
         localStorage.setItem('access_token', response.data?.access);
    localStorage.setItem('refresh_token', response.data?.refresh);
      setTimeout(() => navigate('/admin'), 1000);
    }
      
    } catch (error) {
      console.log(error)
      
    }
  }
  return (
    // <div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="w-full md:max-w-lg h-full bg-blue-950 p-8 border border-blue-950">
      <div className="w-full md:max-w-md bg-white rounded-xs shadow-lg p-8">
        <h2 className="text-xl font-bold text-blue-950 text-center mb-6">Admin Login</h2>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-blue-950 font-medium mb-1 text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-b border-gray-300 outline-none text-sm"
              required
              value={userName}
              onChange={(e)=>setUserName(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-blue-950 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-b border-gray-300 outline-none text-sm"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-950 text-white py-2 rounded-xs hover:bg-blue-900 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Footer or link */}
        <p className="text-center text-xs text-blue-950 mt-4">
          I don't have an account? <a href="" className="text-blue-800 font-bold" onClick={()=>setShowSignin(false)}>Register</a>
        </p>
      </div>
    </div>
  );
}
