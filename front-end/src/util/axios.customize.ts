import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface AxiosResponseData<T> {
    message: string;
    data: T;
}

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(
    function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error: AxiosError): Promise<AxiosError> {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    function <T>(response: AxiosResponse<AxiosResponseData<T>>): T {
        return response.data.data;
    },
    function (error: AxiosError): Promise<AxiosError> {
        return Promise.reject(error);
    },
);

export default instance;
