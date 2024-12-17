import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
    // baseURL: '/api/v1/',
    baseURL: 'http://localhost:8080/api/v1/',
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        let token = localStorage.getItem('access_token');
        if (window.location.pathname.includes('admin')) {
            token = sessionStorage.getItem('admin_access_token');
        }
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response) {
            if (response.status === 401) {
                const currentPath = window.location.pathname;
                if (currentPath.includes('admin')) {
                    sessionStorage.removeItem('admin_access_token');
                    window.location.href = '/admin/login';
                } else {
                    if (currentPath === '/') {
                        return response;
                    }
                    localStorage.removeItem('access_token');
                    window.location.href = '/login';
                }
            }
            return response;
        }
        return Promise.reject(error);
    },
);

export default instance;
