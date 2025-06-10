import axios from 'axios';

const RETRY_DELAY = parseInt(import.meta.env.VITE_RETRY_DELAY || '3000', 10);
const MAX_RETRIES = parseInt(import.meta.env.VITE_RETRY_MAX_ATTEMPTS || '3', 10);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    originalRequest.__retryCount = originalRequest.__retryCount || 0;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`);

        // Retry the request if token was refreshed
        return apiClient(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    // Handle network errors
    if (!error.response && error.code === 'ERR_NETWORK') {
      // Check if the request has reached the maximum number of retries
      if (originalRequest.__retryCount < MAX_RETRIES) {
        originalRequest.__retryCount++;
        // Retry the request after a delay
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
