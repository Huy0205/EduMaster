import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
    baseURL: '/api/v1/',
    // baseURL:'http://localhost:8080/api/v1/',
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
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
        if (error?.response) return error?.response;
        return Promise.reject(error);
    },
);

export default instance;
