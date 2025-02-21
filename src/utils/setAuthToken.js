import axios from 'axios';

// Set up Axios interceptor to include Bearer token in Authorization header
const setAuthToken = () => {
  // Get the access token from localStorage
  const token = localStorage.getItem('accessToken');

  if (token) {
    // Set the Authorization header for all Axios requests
    axios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  } else {
    // Optionally handle if no token is found
    console.warn('No access token found in localStorage');
  }
};

export default setAuthToken;
