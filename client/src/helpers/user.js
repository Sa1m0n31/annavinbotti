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

const updateUser = (id, address, firstName, lastName, email, phoneNumber, street, building, flat, postalCode, city) => {
    return axios.put('/user/update-user-data', {
       id, address, firstName, lastName, email, phoneNumber, street, building, flat,
       postalCode, city
    });
}

const logout = () => {
    logoutUser()
        .then((res) => {
            window.location = '/';
        });
}

export { getUserInfo, getUserOrders, updateUser, logout }
