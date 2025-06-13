import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaEnvelope, FaPhone, FaLink, FaLock, FaIdCard } from 'react-icons/fa';
import { register } from '../service/api';
import AdminLogin from './AdminLogin';


const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: '',
    owner_name: '',
    email: '',
    contact: '',
    business_link: '',
    plan: '499',
    place_id:'',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSignin,setShowSignin] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();    
    // console.log("called");
    // const placeId = await getPlaceIdFromName(formData.business_link);
    // console.log(placeId,'place id');
    
    try {
        const data = {
            business_name:formData.business_name,
            email:formData.email,
            contact_number:formData.contact,
            business_link:formData.business_link,
            amount:formData.plan,
            place_id: formData.place_id,
        }
      const response = await register(data);
      if(response.status === 201) {
        setSuccess('Account created successfully');
        // Save tokens to localStorage
    localStorage.setItem('access_token', response.data?.access);
    localStorage.setItem('refresh_token', response.data?.refresh);
      setTimeout(() => navigate('/admin'), 1500);}
    } catch (err) {
      console.log(err?.response?.data?.message);
      
      setError(err?.response?.data?.message || 'Registration failed');
    }
    setTimeout(() => navigate('/admin'), 1000);
  };
//  const getPlaceIdFromName = async (placeName: string): Promise<string> => {
//   if (!window.google || !window.google.maps || !window.google.maps.places.Place) {
//     throw new Error("Google Maps Place API not available");
//   }

//   const place = new google.maps.places.Place({
//     query: placeName,
//     fields: ['place_id'],
//   });
// console.log(place);

// try {
//   const result = await place.fetchFields(); // New method to fetch details
//   console.log(result);
//     const placeId = result.place_id;
//     console.log("✅ Found place ID:", placeId);
//     return placeId;
//   } catch (error) {
//     console.error("❌ Error fetching place ID:", error);
//     throw new Error("Place not found");
//   }
// };



  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-45px)] bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="md:flex justify-center items-center mx-auto bg-white m-4 mt-0 mb-0">
        {/* Left Image (desktop only) */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-8">
          <img
            src="/User.webp"
            // src="https://cdn.botpenguin.com/assets/website/User_Ratings_94a47fdd71.webp"
            //   src="https://okcredit-blog-images-prod.storage.googleapis.com/2021/04/businessregisteration1.jpg"
            alt="Business Registration"
            className="max-w-lg w-full "
          />
        </div>
        {/* Form */}
        <div className={`w-full md:w-1/2 min-h-[calc(100vh-45px)] flex items-center justify-center p-2 ${showSignin? "bg-blue-950":"bg-white"}`}>
                {
                  showSignin ? (<AdminLogin setShowSignin={setShowSignin}/>):(
          <div className="w-full max-w-lg bg-white p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
              Business Registration
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mb-4 text-center">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                name="business_name"
                placeholder="Business Name"
                onChange={handleChange}
                Icon={FaBuilding}
              />
              <InputField
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                Icon={FaEnvelope}
              />
              <InputField
                name="contact"
                placeholder="Contact Number"
                onChange={handleChange}
                Icon={FaPhone}
              />
              <InputField
                name="business_link"
                placeholder="Business Website/Link"
                onChange={handleChange}
                Icon={FaLink}
              />
              <InputField
                name="place_id"
                placeholder="Google Place Id"
                onChange={handleChange}
                Icon={FaIdCard}
              />
              {/* <InputField name="plan" value="Rs 499/" disabled Icon={FaLock} /> */}

              <button
                type="submit"
                className="bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-xs w-full transition duration-200 shadow-md"
              >
                Register
              </button>
            </form>
            <p className='text-xs my-3'>Already have an account? <span className='text-blue-950 font-bold cursor-pointer hover:text-blue-700' onClick={()=>setShowSignin(true)}>SignIn</span></p>
          </div>
                  )
                }
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const InputField = ({ name, type = 'text', placeholder, value, onChange, disabled = false, Icon }) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
    <input
      type={type}
      name={name}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full pl-10 pr-4 py-2 border-b ${
        disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
      } rounded-xs shadow-sm outline-none transition duration-200`}
      required={!disabled}
    />
  </div>
);

export default AdminRegister;
