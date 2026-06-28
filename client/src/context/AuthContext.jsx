import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('tt_token'));
  const [loading, setLoading] = useState(true); // true while verifying stored token

  /**
   * On mount: if a token is stored, verify it with GET /api/auth/me
   * so the user stays logged in after a page refresh.
   */
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get(`${BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch {
        // Token invalid / expired — clear it silently
        localStorage.removeItem('tt_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []); // eslint-disable-line

  /** Persist token helper */
  const saveToken = (t) => {
    localStorage.setItem('tt_token', t);
    setToken(t);
  };

  /** Register */
  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await axios.post(`${BASE}/auth/register`, { name, email, password });
    saveToken(data.token);
    setUser(data.user);
    toast.success(`Welcome, ${data.user.name}! 🎉`);
    return { success: true };
  }, []);

  /** Login */
  const login = useCallback(async ({ email, password }) => {
    const { data } = await axios.post(`${BASE}/auth/login`, { email, password });
    saveToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 👋`);
    return { success: true };
  }, []);

  /** Update Profile */
  const updateProfile = useCallback(async ({ name, email }) => {
    const { data } = await axios.put(`${BASE}/auth/profile`, { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(data.user);
    toast.success('Profile updated successfully');
    return { success: true };
  }, [token]);

  /** Update Password */
  const updatePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      await axios.put(`${BASE}/auth/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update password');
      return { success: false };
    }
  }, [token]);

  /** Logout */
  const logout = useCallback(() => {
    localStorage.removeItem('tt_token');
    setToken(null);
    setUser(null);
    toast('Logged out', { icon: '👋' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
