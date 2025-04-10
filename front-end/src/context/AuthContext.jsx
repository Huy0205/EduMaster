'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserService } from '~/services';
import { fetchUserWithFrame } from '~/util/authHelpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuth: false,
        user: null,
    });
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const currentPath = window.location.pathname;
            let token = localStorage.getItem('access_token');
            if (currentPath.includes('admin')) {
                token = sessionStorage.getItem('admin_access_token');
            }

            if (!token) {
                setAuth({ isAuth: false, user: null });
                setIsLoadingAuth(false);
                return;
            }
            try {
                const authRes = await UserService.auth();
                const { data, message } = authRes.data;
                if (!data) throw new Error(message);
                const userWithFrame = await fetchUserWithFrame(data);
                setAuth({ isAuth: true, user: userWithFrame });
            } catch (error) {
                console.log('Error fetching user:', error);
                setAuth({ isAuth: false, user: null });
            } finally {
                setIsLoadingAuth(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, isLoadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
