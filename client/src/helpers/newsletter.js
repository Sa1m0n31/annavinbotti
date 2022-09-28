import axios from "axios";
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw, convertToRaw} from "draft-js";

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

const sendResignationLink = (email) => {
    return axios.post(`/newsletter-api/send-resignation-link`, {
        email
    });
}

const verifyNewsletter = (token) => {
    return axios.post('/newsletter-api/verify', {
        token
    });
}

const sendNewsletter = (title, content, image) => {
    let htmlContent = stateToHTML((convertFromRaw(convertToRaw(content?.getCurrentContent()))));

    if(image) {
       htmlContent = `<img src="${image}" alt="img" style="display: block; width: 90%; margin: 0 auto 30px;" />${htmlContent}`;
    }

    return axios.post(`/newsletter-api/send`, {
        title,
        content: htmlContent
    });
}

const sendMailToClients = (title, content) => {
    let htmlContent = stateToHTML((convertFromRaw(convertToRaw(content?.getCurrentContent()))));

    return axios.post(`/newsletter-api/send-email-to-clients`, {
        title,
        content: htmlContent
    });
}

export { getAllNewsletterSubscribers, registerToNewsletter, deleteFromNewsletter,
    verifyNewsletter, sendNewsletter, sendResignationLink, sendMailToClients }
