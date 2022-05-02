import axios from "axios";

const getAllProducts = () => {
    return axios.get('/products/get-all');
}

const getProductDetails = (id) => {
    return axios.get('/products/get', {
        params: {
            id
        }
    })
}

const addProduct = () => {
    return axios.post('/products/add', {

    });
}

const addAddon = (namePl, nameEn, type, options) => {
    return axios.post('/addons/add', {
        namePl, nameEn, type
    });
}

const addAddonOption = (addon, namePl, nameEn, color, img) => {
    let formData = new FormData();

    formData.append('image', img);
    formData.append('addon', addon);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('color', color);

    return axios.post('/addons/add-option', formData);
}

export { getAllProducts, getProductDetails, addProduct, addAddon, addAddonOption }
