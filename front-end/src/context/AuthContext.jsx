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
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoadingAuth(false);
                console.log('stop');
                return;
            }
            try {
                const authRes = await UserService.auth();
                const { data, message } = authRes.data;
                if (!data) throw new Error(message);
                const userWithFrame = await fetchUserWithFrame(data);
                console.log('userWithFrame', userWithFrame);
                setAuth({ isAuth: true, user: userWithFrame });
            } catch (error) {
                console.log('Error fetching user:', error);
                setAuth({ isAuth: false, user: null });
            } finally {
                console.log('finally');
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
