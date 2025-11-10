import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDevAuthDisabled = import.meta.env.VITE_DISABLE_AUTH === 'true';

  useEffect(() => {
    if (isDevAuthDisabled) {
      const mockUser = {
        id: 'dev-001',
        name: 'Dev User',
        email: 'dev@email.com',
        password: 'senha123',
      };
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
      setLoading(false);
      console.warn('[Auth] Using mock user (VITE_DISABLE_AUTH=true)');
      return;
    }

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
    if (isDevAuthDisabled) {
      const mockUser = JSON.parse(localStorage.getItem('userData'));
      setUser(mockUser);
      return mockUser;
    }

    const responseLogin = await authAPI.login({ email, password });
    const token = responseLogin.data.access_token;

    if (!token) {
      throw new Error('Token não recebido no login');
    }

    localStorage.setItem('authToken', token);

    const responseProfile = await authAPI.getProfile();
    setUser(responseProfile.data);
    localStorage.setItem('userData', JSON.stringify(responseProfile.data));

    return responseProfile.data;
  };

  const register = async (userData) => {
    console.log('[useAuth] Iniciando registro com dados:', userData);
    
    try {
      const response = await authAPI.register(userData);
      console.log('[useAuth] Resposta do registro:', response);
      
      // VERSÃO FLEXÍVEL - tenta ambos os formatos de token
      const token = response.data.token || response.data.access_token;
      console.log('[useAuth] Token recebido:', token);

      if (!token) {
        console.error('[useAuth] Nenhum token encontrado na resposta:', response.data);
        throw new Error('Token não recebido no registro');
      }

      localStorage.setItem('authToken', token);
      console.log('[useAuth] Token salvo no localStorage');

      // Busca o perfil do usuário
      console.log('[useAuth] Buscando perfil do usuário...');
      const responseProfile = await authAPI.getProfile();
      console.log('[useAuth] Perfil recebido:', responseProfile.data);
      
      setUser(responseProfile.data);
      localStorage.setItem('userData', JSON.stringify(responseProfile.data));
      console.log('[useAuth] Usuário autenticado com sucesso');

      return responseProfile.data;
      
    } catch (error) {
      console.error('[useAuth] Erro no registro:', error);
      console.error('[useAuth] Detalhes do erro:', {
        response: error.response,
        message: error.message
      });
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Erro ao remover dados de autenticação:', error);
    }
  };

  return { user, login, register, logout, loading };
};