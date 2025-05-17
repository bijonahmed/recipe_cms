import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthUser() {
    const navigate = useNavigate();

    // Load token & user from sessionStorage
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        return tokenString ? JSON.parse(tokenString) : null;
    };

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    };

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    // ✅ Create Axios instance (without token initially)
    const http = axios.create({
        baseURL:
            process.env.NODE_ENV === 'production'
                ? 'https://api.moon-nest.com/api/'
                : 'http://127.0.0.1:8000/api/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // ✅ Set token to state and axios after login
    const saveToken = (user, token) => {
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);

        // ✅ Attach token to axios after login
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    // Logout
    const logout = () => {
        sessionStorage.clear();
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // ✅ Attach token if available (for post-login reloads)
    if (token) {
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http,
        logout,
    };
}
