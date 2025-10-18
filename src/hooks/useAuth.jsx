import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('authToken');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const responseLogin = await authAPI.login({ email, password });
    const token = responseLogin.data.access_token;

    if (!token) {
      throw new Error('Token não recebido no login');
    }

    const responseProfile = await authAPI.getProfile(token);
    if (responseProfile.data) { console.log(responseProfile.data); }

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(responseProfile.data));
    setUser(user);

    return user;
  };

  const register = async (email, password) => {
    const response = await authAPI.register({ email, password });
    const token = response.data.access_token;

    if (!token) {
      throw new Error('Token não recebido no login');
    }

    const responseProfile = await authAPI.getProfile(token);
    if (responseProfile.data) { console.log(responseProfile.data); }

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(responseProfile.data));
    setUser(user);

    return user;
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Erro ao remover dados de autenticação:', error);
    }
  };

  return { user, login, register, logout, loading };
};
