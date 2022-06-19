import axios from "axios";

const getAllNewsletterSubscribers = () => {
    return axios.get('/newsletter-api');
}

const registerToNewsletter = (email) => {
    return axios.post('/newsletter-api/add', {
        email
    });
}

export { getAllNewsletterSubscribers, registerToNewsletter }
