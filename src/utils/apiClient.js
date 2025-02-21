// apiService.js

import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
} from './tokenService';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://move-music-server.vercel.app/api/v1/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add the access token to the headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle invalid/expired tokens
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If the token is invalid (401 or token error)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid infinite loops

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Make a request to refresh the access token using the refresh token
          const response = await axios.post(
            'https://move-music-server.vercel.app/api/v1/auth/refresh-token',
            {
              refresh: refreshToken,
            }
          );
          console.log(response.data, 'middleware');
          

          const { access } = response.data;

          // Store the new tokens
          setTokens(access);

          // Update the original request with the new access token and retry
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return apiClient(originalRequest); // Retry original request with new token
        } catch (refreshError) {
          console.log(refreshError, 'middleware');
          
          // Handle refresh token failure (e.g., refresh token expired or invalid)
          removeTokens();
          window.location.href = '/'; // Redirect to login page
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        window.location.href = '/';
      }
    }

    return Promise.reject(error); // Reject all other errors
  }
);

export default apiClient;
