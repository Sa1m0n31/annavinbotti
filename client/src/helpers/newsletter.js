import axios from "axios";

const getAllNewsletterSubscribers = () => {
    return axios.get('/newsletter');
}

const registerToNewsletter = (email) => {
    return axios.post('/newsletter/add', {
        email
    });
}

export { getAllNewsletterSubscribers, registerToNewsletter }
