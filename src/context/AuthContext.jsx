import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiEndPoints from '../Util/apiEndpoints';
import axiosInstance, {
  clearTokens,
  getAccessToken,
  setTokens,
} from '../Util/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { id, email, firstName, lastName, photoUrl, roles }
  const [loading, setLoading] = useState(true);  // true while we validate any existing token on first load
  const [authError, setAuthError] = useState(null);

  // On app start: if a token is already in localStorage (page refresh), verify
  // it against the backend and restore the session instead of forcing re-login.
  const loadCurrentUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await axiosInstance.get(apiEndPoints.ME);
      setUser(data);
    } catch (err) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const register = useCallback(async ({ firstName, lastName, email, password }) => {
    setAuthError(null);
    try {
      const { data } = await axiosInstance.post(apiEndPoints.REGISTER, {
        firstName,
        lastName,
        email,
        password,
      });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null);
    try {
      const { data } = await axiosInstance.post(apiEndPoints.LOGIN, { email, password });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async ({ firstName, lastName, email }) => {
    setAuthError(null);
    try {
      const { data } = await axiosInstance.put(apiEndPoints.UPDATE_PROFILE, {
        firstName,
        lastName,
        email,
      });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const updatePhoto = useCallback(async (file) => {
    setAuthError(null);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const { data } = await axiosInstance.post(apiEndPoints.UPDATE_PROFILE_PHOTO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to upload photo. Please try again.';
      setAuthError(message);
      return { success: false, message };
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    updatePhoto,
    refreshUser: loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
