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
        const response = await authAPI.login({ email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('authToken', token);
        setUser(user);
        return user;
    };

    const register = async (email, password) => {
        const response = await authAPI.register({ email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('authToken', token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    return { user, login, register, logout, loading };
};