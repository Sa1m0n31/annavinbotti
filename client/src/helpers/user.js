import axios from "axios";
import {logoutUser} from "./auth";

const getUserInfo = () => {
    return axios.get('/user/get-user-info', {
        withCredentials: true
    });
}

const getUserOrders = () => {
    return axios.get('/user/get-user-orders', {
        withCredentials: true
    });
}

const logout = () => {
    logoutUser()
        .then((res) => {
            window.location = '/';
        });
}

export { getUserInfo, getUserOrders, logout }
