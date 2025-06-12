
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

// login user
export const loginUser = async(data)=>{
    console.log('called',data);
    
    const response = await axios.post(`${apiUrl}/login/`,data);
    return response
}

// register user
export const register = async(data) => {
    console.log(data);
    
    const response = await axios.post(`${apiUrl}/register/`, data);
    return response
}
// admin dashboard data
export const adminDashboard = async() => {
    const token = localStorage.getItem('access_token');

    const response = await axios.get(`${apiUrl}/profile/`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response
}
// get organisation data
export const getOrganisationData = async(id) => {
    const response = await axios.get(`${apiUrl}/organizationdetail/${id}/`);
    return response
}
// save review
export const saveReview = async(id,data) => {
    const response = await axios.post(`${apiUrl}/submit_review/${id}/`, data,);
    return response
}
// get all reviews
export const allReviews = async()=>{
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${apiUrl}/business-review/`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response
}
