import axios from "axios";
import {convertToRaw} from "draft-js";

const getTermsPl = () => {
    return axios.get('/content/get-terms-pl');
}

const getTermsEn = () => {
    return axios.get('/content/get-terms-en');
}

const updateTermsPl = (terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11) => {
    return axios.put('/content/update-terms-pl', {
        terms: JSON.stringify(convertToRaw(terms?.getCurrentContent())),
        policy: JSON.stringify(convertToRaw(policy?.getCurrentContent())),
        page1: JSON.stringify(convertToRaw(page1?.getCurrentContent())),
        page2: JSON.stringify(convertToRaw(page2?.getCurrentContent())),
        page3: JSON.stringify(convertToRaw(page3?.getCurrentContent())),
        page4: JSON.stringify(convertToRaw(page4?.getCurrentContent())),
        page5: JSON.stringify(convertToRaw(page5?.getCurrentContent())),
        page6: JSON.stringify(convertToRaw(page6?.getCurrentContent())),
        page7: JSON.stringify(convertToRaw(page7?.getCurrentContent())),
        page8: JSON.stringify(convertToRaw(page8?.getCurrentContent())),
        page9: JSON.stringify(convertToRaw(page9?.getCurrentContent())),
        page10: JSON.stringify(convertToRaw(page10?.getCurrentContent())),
        page11: JSON.stringify(convertToRaw(page11?.getCurrentContent()))
    });
}

const updateTermsEn = (terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11) => {
    return axios.put('/content/update-terms-en', {
        terms: JSON.stringify(convertToRaw(terms?.getCurrentContent())),
        policy: JSON.stringify(convertToRaw(policy?.getCurrentContent())),
        page1: JSON.stringify(convertToRaw(page1?.getCurrentContent())),
        page2: JSON.stringify(convertToRaw(page2?.getCurrentContent())),
        page3: JSON.stringify(convertToRaw(page3?.getCurrentContent())),
        page4: JSON.stringify(convertToRaw(page4?.getCurrentContent())),
        page5: JSON.stringify(convertToRaw(page5?.getCurrentContent())),
        page6: JSON.stringify(convertToRaw(page6?.getCurrentContent())),
        page7: JSON.stringify(convertToRaw(page7?.getCurrentContent())),
        page8: JSON.stringify(convertToRaw(page8?.getCurrentContent())),
        page9: JSON.stringify(convertToRaw(page9?.getCurrentContent())),
        page10: JSON.stringify(convertToRaw(page10?.getCurrentContent())),
        page11: JSON.stringify(convertToRaw(page11?.getCurrentContent()))
    });
}

const getFAQ = () => {
    return axios.get('/content/get-faq');
}

const getStats = (name) => {
    return axios.get(`/content/get-${name}-stats`);
}

const getField = (field) => {
    return axios.get('/content/get-field', {
        params: {
            field
        }
    });
}

export { getTermsPl, getTermsEn, updateTermsPl, updateTermsEn, getStats, getFAQ, getField }
