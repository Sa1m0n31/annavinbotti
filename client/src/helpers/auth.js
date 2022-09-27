import axios from "axios";
import settings from '../static/settings'
import Cookies from 'universal-cookie';

const { API_URL } = settings;

const isLoggedIn = () => {
    return axios.get(`${API_URL}/user/auth`, {
        withCredentials: true
    });
}

const autoLogin = (userId, identity) => {
    return axios.post(`${API_URL}/auth/auto-login`, {
        username: userId,
        password: identity
    }, {
        withCredentials: true
    });
}

const loginUser = (email, password) => {
    return axios.post(`${API_URL}/user/login`, {
        username: email,
        password: password
    }, {
        withCredentials: true
    });
}

const loginAdmin = (login, password) => {
    return axios.post(`${API_URL}/admin-api/auth`, {
        login, password
    }, {
        withCredentials: true
    });
}

const secondLoginAdmin = (code) => {
    return axios.post(`${API_URL}/admin-api/auth-code`, {
        code
    }, {
        withCredentials: true
    });
}

const registerUser = (email, password, newsletter) => {
    return axios.post(`${API_URL}/user/register`, {
        email, password, newsletter
    });
}

const verifyUser = (token) => {
    return axios.get(`${API_URL}/user/verification`, {
        params: {
            token
        }
    });
}

const logoutUser = () => {
    return axios.get(`${API_URL}/user/logout`, {
        withCredentials: true
    });
}

const authAdmin = () => {
    return axios.get(`${API_URL}/admin-api/auth`, {}, {
        withCredentials: true
    });
}

const logoutAdmin = () => {
    const cookies = new Cookies();
    cookies.remove('access_token', { path: '/' });
    window.location = '/admin';
}

export { authAdmin, isLoggedIn, loginUser, loginAdmin, secondLoginAdmin,
    registerUser, verifyUser, logoutUser, autoLogin, logoutAdmin }
