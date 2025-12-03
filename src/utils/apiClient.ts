import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useRouter } from 'vue-router';

const RETRY_DELAY = parseInt(import.meta.env.VITE_RETRY_DELAY || '3000', 10);
const MAX_RETRIES = parseInt(import.meta.env.VITE_RETRY_MAX_ATTEMPTS || '3', 10);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle only Axios errors
    if (isAxiosError(error) === false) return Promise.reject(error);
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    if (error.response?.status === 401 && !originalRequest._retryCount) {
      try {
        // Refresh token
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // Retry the request if token was refreshed
        return apiClient(originalRequest);
      } catch (refreshErr) {
        const router = useRouter();
        // Redirect to login page if refresh fails and show a toast message
        router.push({ name: 'login' });

        return Promise.reject(refreshErr);
      }
    }

    // Handle network errors
    if (!error.response && error.code === 'ERR_NETWORK') {
      // Handle undefined value of _retryCount
      if (!originalRequest._retryCount) originalRequest._retryCount = 0;

      // Check if the request has reached the maximum number of retries
      if (originalRequest._retryCount < MAX_RETRIES) {
        originalRequest._retryCount++;
        // Retry the request after a delay
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
