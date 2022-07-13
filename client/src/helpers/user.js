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

const getForm = (type, formType) => {
    return axios.get('/forms/get-form', {
        params: {
            type, formType
        }
    });
}

const sendForm = (formData, formType, orderId, type, formJSON) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    formData.append('formType', formType);
    formData.append('orderId', orderId);
    formData.append('type', type);

    if(formType === 1) {
        formData.append('formJSON', JSON.stringify(formJSON
            .flat()
            .map((item) => {
                return {
                    type: item.type === 1 ? 'txt' : 'img',
                    name: Object.entries(item)[1][0],
                    value: Object.entries(item)[1][1]
                }
            })));
    }
    else {
        formData.append('formJSON', JSON.stringify(formJSON));
    }

    return axios.post('/forms/send-form', formData, config);
}

const getOrdersWithEmptyFirstTypeForms = () => {
    return axios.get('/forms/get-orders-with-empty-first-type-forms', {
        withCredentials: true
    });
}

const getOrdersWithEmptySecondTypeForms = () => {
    return axios.get('/forms/get-orders-with-empty-second-type-forms', {
        withCredentials: true
    });
}

const logout = () => {
    logoutUser()
        .then((res) => {
            window.location = '/';
        });
}

export { getUserInfo, getUserOrders, updateUser, logout, getForm, sendForm,
    getOrdersWithEmptyFirstTypeForms, getOrdersWithEmptySecondTypeForms }
