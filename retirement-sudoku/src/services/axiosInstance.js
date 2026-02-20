import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.bajajlife.com/v1',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'X-Source': 'retirement-sudoku',
    },
});

// Request interceptor — attach auth token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? window.__APP_TOKEN__ : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with an error status
            const message = error.response.data?.message || 'Server error. Please try again.';
            return Promise.reject({ ...error, message });
        }
        if (error.request) {
            // No response received
            return Promise.reject({ ...error, message: 'Network error. Please check your connection.' });
        }
        return Promise.reject({ ...error, message: 'Unexpected error. Please try again.' });
    }
);

export default axiosInstance;
