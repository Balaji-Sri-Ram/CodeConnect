import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { BASE_URL };

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle expired/invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired or invalid — clear stale session data
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userId');

            // Redirect to auth page (only if not already there)
            if (window.location.pathname !== '/auth' && window.location.pathname !== '/forgot-password') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

// In-flight GET request deduplication
// If multiple components (e.g. Navbar, Dashboard, ProfileRouter) request the same endpoint
// concurrently, share the same in-flight Promise so only 1 network request hits the backend.
const inFlightGetRequests = new Map();

const originalGet = api.get.bind(api);
api.get = (url, config = {}) => {
    const token = localStorage.getItem('token') || 'anon';
    const key = `${token}:${url}:${JSON.stringify(config.params || {})}`;

    if (inFlightGetRequests.has(key)) {
        return inFlightGetRequests.get(key);
    }

    const promise = originalGet(url, config)
        .finally(() => {
            inFlightGetRequests.delete(key);
        });

    inFlightGetRequests.set(key, promise);
    return promise;
};

export default api;

