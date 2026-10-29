import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('thread_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('thread_admin_token') || null);
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/admin/login', { email, password });
      const { accessToken, user } = res.data;
      setToken(accessToken);
      setAdminUser(user);
      localStorage.setItem('thread_admin_token', accessToken);
      localStorage.setItem('thread_admin_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('thread_admin_token');
    localStorage.removeItem('thread_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token,
        isAdmin: adminUser?.role === 'ADMIN',
        loginAdmin,
        logoutAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
