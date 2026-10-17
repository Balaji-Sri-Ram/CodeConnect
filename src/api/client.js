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

// Add a response interceptor to handle expired/invalid tokens safely
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const hadAuthHeader = error.config?.headers?.Authorization;
            const publicRoutes = ['/', '/auth', '/forgot-password', '/all-problems', '/companies', '/leaderboard'];
            const isPublic = publicRoutes.includes(window.location.pathname) || window.location.pathname.startsWith('/developer/');

            // Only clear and redirect if the request had an auth header and user was on a protected route
            if (hadAuthHeader && !isPublic) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('userId');

                if (window.location.pathname !== '/auth') {
                    window.location.href = '/auth';
                }
            }
        }
        return Promise.reject(error);
    }
);

// Targeted in-flight deduplication for /profile/me
// Prevents duplicate concurrent requests on initial page load while avoiding any side effects on other routes
const inFlightProfileRequests = new Map();

const originalGet = api.get.bind(api);
api.get = (url, config = {}) => {
    if (url === '/profile/me') {
        const token = localStorage.getItem('token') || 'anon';
        const key = `${token}:${url}`;

        if (inFlightProfileRequests.has(key)) {
            return inFlightProfileRequests.get(key);
        }

        const promise = originalGet(url, config)
            .finally(() => {
                inFlightProfileRequests.delete(key);
            });

        inFlightProfileRequests.set(key, promise);
        return promise;
    }

    return originalGet(url, config);
};

export default api;

