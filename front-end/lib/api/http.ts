import axios from "axios";
import Cookies from "js-cookie";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

http.interceptors.request.use((config) => {
    const token = Cookies.get('token');   
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {        
        if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href="/login"
        }
        return Promise.reject(error);
    }
);

export default http;
