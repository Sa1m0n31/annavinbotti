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

const getAllAddons = () => {
    return axios.get('/addons/all');
}

const getAddonById = (id) => {
    return axios.get('/addons/get', {
        params: {
            id
        }
    });
}

const addAddon = (namePl, nameEn, type, options) => {
    return axios.post('/addons/add', {
        namePl, nameEn, type
    });
}

const addAddonOption = (addon, namePl, nameEn, color, img, oldImage = '') => {
    let formData = new FormData();

    formData.append('oldImage', oldImage)
    formData.append('image', img);
    formData.append('addon', addon);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('color', color);

    return axios.post('/addons/add-option', formData);
}

const updateAddon = (id, namePl, nameEn, type) => {
    return axios.patch('/addons/update', {
        id, namePl, nameEn, type
    });
}

const updateAddonOption = (id, addon, namePl, nameEn, color, img) => {
    let formData = new FormData();

    formData.append('id', id);
    formData.append('image', img);
    formData.append('addon', addon);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('color', color);

    return axios.post('/addons/add-option', formData);
}

const deleteAddonOptions = (id) => {
    return axios.delete('/addons/delete-addon-options', {
        params: {
            id
        }
    });
}

const deleteAddon = (id) => {
    return axios.delete('/addons/delete', {
        params: {
            id
        }
    });
}

const getOptionsByAddon = (id) => {
    return axios.get('/addons/get-options-by-addon', {
        params: {
            id
        }
    });
}

const getAddonsByProduct = (id) => {
    return axios.get(`/addons/get-addons-by-product`, {
        params: {
            id
        }
    });
}

const getAllTypes = () => {
    return axios.get('/types/all');
}

const getTypeById = (id) => {
    return axios.get('/types/get', {
        params: {
            id
        }
    });
}

const addType = (namePl, nameEn) => {
    return axios.post('/types/add', {
        namePl, nameEn
    });
}

const updateType = (id, namePl, nameEn) => {
    return axios.put('/types/update', {
        id, namePl, nameEn
    });
}

const deleteType = (id) => {
    return axios.delete('/types/delete', {
        params: {
            id
        }
    });
}

export { getAllProducts, getProductDetails, addProduct, addAddon, addAddonOption, getAllAddons, getAddonById,
        deleteAddon, getOptionsByAddon, updateAddon, updateAddonOption, deleteAddonOptions, getAddonsByProduct,
    getAllTypes, deleteType, updateType, addType, getTypeById
}
