import axios from "axios";

const getAllOrders = () => {
    return axios.get('/orders/all');
}

const getOrderById = (id) => {
    return axios.get('/orders', {
        params: {
            id
        }
    });
}

const changeOrderStatus = (id, status) => {
    return axios.put('/orders/change-status', {
        status, id
    });
}

const getOrderForms = (id) => {
    return axios.get('/orders/get-order-forms', {
        params: {
            id
        }
    });
}

const deleteOrder = (id) => {
    return axios.delete('/orders/delete', {
        params: {
            id
        }
    });
}

const getOrderStatuses = () => {
    return axios.get('/orders/get-order-statuses');
}

const getFormDetails = (form, sell) => {
    return axios.get('/orders/get-form-details', {
        params: {
            form, sell
        }
    });
}

const addOrder = (user, userAddress, deliveryAddress, nip, companyName, sells, addons) => {
    return axios.post('/orders/add', {
        user, userAddress, deliveryAddress, nip, companyName, sells, addons
    });
}

const getNumberOfFirstTypeFormsByOrder = (id) => {
    return axios.get('/orders/get-number-of-first-type-forms-by-order', {
        params: {
            id
        }
    });
}

const getNumberOfSecondTypeFormsByOrder = (id) => {
    return axios.get('/orders/get-number-of-second-type-forms-by-order', {
        params: {
            id
        }
    });
}

export { getAllOrders, getOrderById, changeOrderStatus, getOrderForms, deleteOrder,
    getOrderStatuses, getFormDetails, addOrder, getNumberOfFirstTypeFormsByOrder, getNumberOfSecondTypeFormsByOrder }
