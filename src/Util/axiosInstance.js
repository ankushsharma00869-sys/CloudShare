import axios from 'axios';
import apiEndPoints, { BASE_URL } from './apiEndpoints';

// Keys used in localStorage. Centralized here so AuthContext and this file
// always agree on where the tokens live.
export const ACCESS_TOKEN_KEY = 'cloudshare_access_token';
export const REFRESH_TOKEN_KEY = 'cloudshare_refresh_token';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// ---------------------------------------------------------------------------
// React
//   ↓
// axiosInstance.get/post/...  (no manual headers needed anywhere in the app)
//   ↓  [REQUEST INTERCEPTOR] -> attaches Authorization: Bearer <token>
//   ↓
// Spring Security JwtAuthFilter -> token validation -> Controller -> MongoDB
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = (newAccessToken) => {
  pendingRequests.forEach((cb) => cb(newAccessToken));
  pendingRequests = [];
};

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];

// If the backend ever returns 401 (invalid/expired token), try ONE silent
// refresh using the refresh token; if that also fails, force logout.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthCall = AUTH_PATHS.some((p) => originalRequest?.url?.includes(p));

    if (status !== 401 || isAuthCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Another request already triggered a refresh — wait for it instead of
      // firing a second /auth/refresh call.
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(apiEndPoints.REFRESH_TOKEN, { refreshToken });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      resolvePendingRequests(data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      resolvePendingRequests(null);
      clearTokens();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default axiosInstance;
