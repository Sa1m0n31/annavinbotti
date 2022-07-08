import axios from "axios";
import settings from '../static/settings'

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
    return axios.post(`${API_URL}/auth/admin`, {
        username: login,
        password: password
    }, {
        headers: {
            'Access-Control-Allow-Origin': API_URL
        },
        withCredentials: true
    });
}

const registerUser = (login, email, password, newsletter) => {
    return axios.post(`${API_URL}/user/register`, {
        login, email, password, newsletter
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
        headers: {
            'Access-Control-Allow-Origin': API_URL
        },
        withCredentials: true
    });
}

export { isLoggedIn, loginUser, loginAdmin,
    registerUser, verifyUser, logoutUser, autoLogin }
