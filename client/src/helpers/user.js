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

const sendWorkingForm = (formData, orderId, type, formJSON) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    formData.append('orderId', orderId);
    formData.append('type', type);

    formData.append('formJSON', JSON.stringify(formJSON
        .flat()
        .map((item) => {
            if(item.type === 3) {
                return [
                    {
                        type: 'txt',
                        name: Object.entries(item)[1][0],
                        value: Object.entries(item)[1][1]
                    },
                    {
                        type: 'img',
                        name: Object.entries(item)[2][0],
                        value: Object.entries(item)[2][1]
                    }
                ]
            }
            else {
                return {
                    type: item.type === 1 ? 'txt' : 'img',
                    name: Object.entries(item)[1][0],
                    value: Object.entries(item)[1][1]
                }
            }
        })
        .flat()
    ));

    return axios.post('/forms/send-working-form', formData, config);
}

const getWorkingForm = (order, type) => {
    return axios.get('/forms/get-working-form', {
        params: {
            order, type
        }
    });
}

const sendForm = (formData, formType, orderId, type, formJSON, email) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    formData.append('formType', formType);
    formData.append('orderId', orderId);
    formData.append('type', type);
    formData.append('email', email);

    if(formType === 1) {
        formData.append('formJSON', JSON.stringify(formJSON
            .flat()
            .map((item) => {
                if(item.type === 3) {
                    return [
                        {
                            type: 'txt',
                            name: Object.entries(item)[1][0],
                            value: Object.entries(item)[1][1]
                        },
                        {
                            type: 'img',
                            name: Object.entries(item)[2][0],
                            value: Object.entries(item)[2][1]
                        }
                    ]
                }
                else {
                    return {
                        type: item.type === 1 ? 'txt' : 'img',
                        name: Object.entries(item)[1][0],
                        value: Object.entries(item)[1][1]
                    }
                }
            })
            .flat()
        ));
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

const getFirstTypeFilledForm = (order, type) => {
    return axios.get('/forms/get-first-type-filled-form', {
        params: {
            order, type
        }
    });
}

const getSecondTypeFilledForm = (order, type) => {
    return axios.get('/forms/get-second-type-filled-form', {
        params: {
            order, type
        }
    });
}

const remindPassword = (email) => {
    return axios.post('/user/remind-password', {
        email
    });
}

const verifyAccount = (token) => {
    return axios.post('/user/verify-account', {
        token
    });
}

const verifyPasswordToken = (token) => {
    return axios.post('/user/verify-password-token', {
        token
    });
}

const changePassword = (email, password) => {
    return axios.put('/user/change-password', {
        email, password
    });
}

const logout = () => {
    logoutUser()
        .then((res) => {
            window.location = '/';
        });
}

export { changePassword, getUserInfo, getUserOrders, updateUser, logout, getForm, sendForm, verifyPasswordToken,
    getFirstTypeFilledForm, getSecondTypeFilledForm, remindPassword, verifyAccount, sendWorkingForm,
    getOrdersWithEmptyFirstTypeForms, getOrdersWithEmptySecondTypeForms, getWorkingForm }
