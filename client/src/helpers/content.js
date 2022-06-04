import axios from "axios";
import {convertToRaw} from "draft-js";

const getTermsPl = () => {
    return axios.get('/content/get-terms-pl');
}

const getTermsEn = () => {
    return axios.get('/content/get-terms-en');
}

const updateTermsPl = (terms, policy) => {
    return axios.put('/content/update-terms-pl', {
        terms: JSON.stringify(convertToRaw(terms?.getCurrentContent())),
        policy: JSON.stringify(convertToRaw(policy?.getCurrentContent()))
    });
}

const updateTermsEn = (terms, policy) => {
    return axios.put('/content/update-terms-en', {
        terms: JSON.stringify(convertToRaw(terms?.getCurrentContent())),
        policy: JSON.stringify(convertToRaw(policy?.getCurrentContent()))
    });
}

export { getTermsPl, getTermsEn, updateTermsPl, updateTermsEn }
