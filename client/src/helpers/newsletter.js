import axios from "axios";

const getAllNewsletterSubscribers = () => {
    return axios.get('/newsletter-api');
}

const registerToNewsletter = (email) => {
    return axios.post('/newsletter-api/add', {
        email
    });
}

const deleteFromNewsletter = (token) => {
    return axios.delete('/newsletter-api/delete', {
        params: {
            token
        }
    });
}

const verifyNewsletter = (token) => {
    return axios.post('/newsletter-api/verify', {
        token
    });
}

export { getAllNewsletterSubscribers, registerToNewsletter, deleteFromNewsletter, verifyNewsletter }
