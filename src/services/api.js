import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    try {
        console.log('Making login request to:', `${API_URL}/auth/login`);
        const response = await api.post('/auth/login', {
            email,
            password
        });
        console.log('Login API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export const getLenses = async () => {
    const response = await api.get('/contact-lenses');
    return response.data;
};

export const createLens = async (lensData) => {
    try {
        console.log('Creating lens with data:', lensData);
        const response = await api.post('/contact-lenses', lensData);
        console.log('Create lens response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Create lens error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
        });
        throw error;
    }
};

export const updateLens = async (id, lensData) => {
    try {
        console.log('Updating lens:', { id, data: lensData });  // Debug log
        const response = await api.put(`/contact-lenses/${id}`, lensData);
        console.log('Update response:', response.data);  // Debug log
        return response.data;
    } catch (error) {
        console.error('Update error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        throw error;
    }
};

export const deleteLens = async (id) => {
    try {
        console.log('Attempting to delete lens:', id);  // Debug log
        const response = await api.delete(`/contact-lenses/${id}`);
        console.log('Delete response:', response.data);  // Debug log
        return response.data;
    } catch (error) {
        console.error('Delete error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        throw error;
    }
};


export default api;