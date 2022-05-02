import axios from "axios";
import settings from '../static/settings'

const { API_URL } = settings;

const isLoggedIn = () => {
    return axios.get(`${API_URL}/auth/auth`, {
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
    return axios.post(`${API_URL}/auth/login`, {
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

const loginFacebook = () => {
    return axios.post(`${API_URL}/auth/facebook`, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        withCredentials: true
    });
}

const loginGoogle = () => {
    return axios.get(`${API_URL}/auth/google`);
}

const loginApple = () => {
    return axios.get(`${API_URL}/auth/apple`);
}

const registerUser = (email, password, firstName, lastName, sex, birthday, phoneNumber, checkboxObligatory, stuff) => {
    return axios.post(`${API_URL}/auth/register-local`, {
        email, password, firstName, lastName, sex, birthday, phoneNumber, checkboxObligatory, stuff
    });
}

const registerFromThirdParty = (firstName, lastName, sex, birthday, phoneNumber, checkboxObligatory) => {
    return axios.post(`${API_URL}/auth/register-from-third-party`, {
        firstName, lastName, sex, birthday, phoneNumber, checkboxObligatory
    }, {
        withCredentials: true
    });
}

const verifyUser = (token) => {
    return axios.get(`${API_URL}/auth/verification`, {
        params: {
            token
        }
    });
}

const logoutUser = () => {
    return axios.get(`${API_URL}/auth/logout`, {
        headers: {
            'Access-Control-Allow-Origin': API_URL
        },
        withCredentials: true
    });
}

const registerSecondAccount = () => {
    return axios.post(`${API_URL}/auth/register-second-type`, {}, {
        withCredentials: true
    });
}

export { isLoggedIn, loginUser, loginAdmin, loginFacebook, loginGoogle, loginApple,
    registerFromThirdParty, registerUser, verifyUser, logoutUser, registerSecondAccount, autoLogin }
