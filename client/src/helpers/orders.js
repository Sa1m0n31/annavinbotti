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

const getOrderStatusChanges = (id) => {
    return axios.get('/orders/get-order-status-changes', {
        params: {
            id
        }
    });
}

const changeOrderStatus = (id, status, email) => {
    return axios.put('/orders/change-status', {
        status, id, email
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

const addOrder = (user, userAddress, deliveryAddress, nip, companyName, sells, addons, shipping, newsletter) => {
    return axios.post('/orders/add', {
        user, userAddress, deliveryAddress, nip, companyName, sells, addons, shipping, newsletter
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

const payOrder = (orderId, paymentMethod, firstName, lastName, email) => {
    return axios.post('/orders/pay', {
        orderId, paymentMethod, firstName, lastName, email
    });
}

const addToWaitlist = (product, email) => {
    return axios.post('/orders/add-to-waitlist', {
        product, email
    });
}

const updateDeliveryNumber = (orderId, deliveryNumber) => {
    return axios.put('/orders/update-order-delivery-number', {
        orderId, deliveryNumber
    });
}

export { getAllOrders, getOrderById, changeOrderStatus, getOrderForms, deleteOrder, payOrder,
    addToWaitlist, updateDeliveryNumber, getOrderStatuses, getFormDetails, addOrder,
    getNumberOfFirstTypeFormsByOrder, getNumberOfSecondTypeFormsByOrder, getOrderStatusChanges }
