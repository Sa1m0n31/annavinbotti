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

const sendNewsletter = (title, content) => {
    let newsletterContent = stateToHTML((convertFromRaw(convertToRaw(content?.getCurrentContent()))));

    return axios.post(`/newsletter-api/send`, {
        title,
        newsletterContent
    });
}

const sendTestNewsletter = (title, content) => {
    let newsletterContent = stateToHTML((convertFromRaw(convertToRaw(content?.getCurrentContent()))));

    return axios.post(`/newsletter-api/send-test-newsletter`, {
        title,
        newsletterContent,
    });
}

const sendMailToClients = (title, content) => {
    let newsletterContent = stateToHTML((convertFromRaw(convertToRaw(content?.getCurrentContent()))));

    return axios.post(`/newsletter-api/send-email-to-clients`, {
        title,
        newsletterContent
    });
}

const getNewsletterInProgress = () => {
    return axios.get(`/newsletter-api/get-newsletter-in-progress`);
}

const saveNewsletter = (title, content) => {
    let htmlContent = JSON.stringify(convertToRaw(content?.getCurrentContent()));

    return axios.post(`/newsletter-api/save-work-in-progress`, {
        title,
        content: htmlContent
    })
}

const getAllNewsletters = () => {
    return axios.get('/newsletter-api/get-all');
}

export { getAllNewsletterSubscribers, saveNewsletter, getNewsletterInProgress, registerToNewsletter, deleteFromNewsletter, sendTestNewsletter,
    verifyNewsletter, sendNewsletter, sendResignationLink, sendMailToClients, getAllNewsletters }
