import axios from "axios";
import { convertToRaw } from 'draft-js';

const getAllProducts = () => {
    return axios.get('/products/get-all');
}

const getShopPage = () => {
    return axios.get('/products/get-shop-page');
}

const getTypesWithProducts = () => {
    return axios.get('/types/get-types-with-products');
}

const getProductDetails = (id) => {
    return axios.get('/products/get', {
        params: {
            id
        }
    })
}

const getProductGallery = (id) => {
    return axios.get(`/products/get-product-gallery`, {
        params: {
            id
        }
    });
}

const getAddonsWithOptions = (ids) => {
    console.log(ids.join(','));
    return axios.get(`/addons/get-addons-with-options`, {
        params: {
            id: ids.join(',')
        }
    });
}

const addProduct = (formData, mainImage, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, price, type, showOnHomepage, priority) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('mainImage', mainImage);
    formData.append('descPl', descPl ? JSON.stringify(convertToRaw(descPl?.getCurrentContent())) : '');
    formData.append('descEn', descPl ? JSON.stringify(convertToRaw(descEn?.getCurrentContent())) : '');
    formData.append('detailsPl', detailsPl ? JSON.stringify(convertToRaw(detailsPl?.getCurrentContent())) : '');
    formData.append('detailsEn', detailsEn ? JSON.stringify(convertToRaw(detailsEn?.getCurrentContent())) : '');
    formData.append('showOnHomepage', showOnHomepage);
    formData.append('priority', priority);

    return axios.post('/products/add', formData, config);
}

const updateProduct = (formData, id, mainImage, namePl, nameEn, descPl, descEn, detailsPl, detailsEn, price, type, showOnHomepage, priority) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    formData.append('id', id);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('mainImage', mainImage);
    formData.append('descPl', descPl ? JSON.stringify(convertToRaw(descPl?.getCurrentContent())) : '');
    formData.append('descEn', descPl ? JSON.stringify(convertToRaw(descEn?.getCurrentContent())) : '');
    formData.append('detailsPl', detailsPl ? JSON.stringify(convertToRaw(detailsPl?.getCurrentContent())) : '');
    formData.append('detailsEn', detailsEn ? JSON.stringify(convertToRaw(detailsEn?.getCurrentContent())) : '');
    formData.append('showOnHomepage', showOnHomepage);
    formData.append('priority', priority);

    return axios.patch('/products/update', formData, config);
}

const deleteProduct = (id) => {
    return axios.delete('/products/delete', {
        params: {
            id
        }
    });
}

const getAllAddons = () => {
    return axios.get('/addons/all');
}

const getAllAddonsOptions = () => {
    return axios.get('/addons/all-options');
}

const getAllAddonsAndAddonsOptions = () => {
    return axios.get('/addons/get-all-addons-options');
}

const getAddonById = (id) => {
    return axios.get('/addons/get', {
        params: {
            id
        }
    });
}

const getHomepageModels = () => {
    return axios.get('/products/get-homepage-models');
}

const addAddon = (namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, image, type, adminName) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let formData = new FormData();

    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('infoPl', infoPl);
    formData.append('infoEn', infoEn);
    formData.append('tooltipPl', tooltipPl);
    formData.append('tooltipEn', tooltipEn);
    formData.append('image', image);
    formData.append('type', type);
    formData.append('adminName', adminName ? adminName : '');

    return axios.post('/addons/add', formData, config);
}

const addAddonOption = (addon, namePl, nameEn, color, img, oldImage = '', tooltipPl, tooltipEn, adminName) => {
    let formData = new FormData();

    formData.append('oldImage', oldImage)
    formData.append('image', img);
    formData.append('addon', addon);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('color', color);
    formData.append('tooltipPl', tooltipPl ? tooltipPl : '');
    formData.append('tooltipEn', tooltipEn ? tooltipEn : '');
    formData.append('adminName', adminName ? adminName : '');

    return axios.post('/addons/add-option', formData);
}

const updateAddon = (id, namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, image, type, adminName) => {
    return axios.patch('/addons/update', {
        id, namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, type,
        adminName: adminName ? adminName : ''
    });
}

const updateAddonOption = (id, addon, namePl, nameEn, color, img, tooltipPl, tooltipEn, adminName) => {
    let formData = new FormData();

    formData.append('id', id);
    formData.append('image', img);
    formData.append('addon', addon);
    formData.append('namePl', namePl);
    formData.append('nameEn', nameEn);
    formData.append('color', color);
    formData.append('tooltipPl', tooltipPl ? tooltipPl : '');
    formData.append('tooltipEn', tooltipEn ? tooltipEn : '');
    formData.append('adminName', adminName ? adminName : '');

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

const addAddonsForProduct = (product, addons) => {
    return axios.post('/products/add-addons-for-product', {
        product, addons: JSON.stringify(addons)
    });
}

const addAddonsConditionsForProduct = (product, conditions) => {
    return axios.post('/products/add-addons-conditions-for-product', {
        product, conditions: JSON.stringify(conditions)
    });
}

const deleteAddonsForProduct = (id) => {
    return axios.delete('/products/delete-addons-for-product', {
        params: {
            id
        }
    });
}

const getAllWaitlists = () => {
    return axios.get('/products/get-all-waitlists');
}

const getWaitlistByProductId = (id) => {
    return axios.get('/products/get-waitlist-by-product-id', {
        params: {
            id
        }
    });
}

const getProductBySlug = (slug) => {
    return axios.get('/products/get-by-slug', {
        params: {
            slug
        }
    });
}

const getProductAddons = (id) => {
    return axios.get('/products/get-product-addons', {
        params: {
            id
        }
    });
}

const getTypeByProduct = (id) => {
    return axios.get('/types/get-type-by-product', {
        params: {
            id
        }
    });
}

const getAllAddonsWithOptions = () => {
    return axios.get('/addons/all-addons-with-options');
}

export { getAllProducts, getProductDetails, getHomepageModels, addProduct, addAddon, addAddonOption, getAllAddons, getAddonById, getAllAddonsAndAddonsOptions,
        deleteAddon, getOptionsByAddon, updateAddon, updateAddonOption, deleteAddonOptions, getAddonsByProduct, getShopPage,
    getAllTypes, deleteType, updateType, addType, getTypeById, deleteProduct, getProductGallery, getAllAddonsOptions,
    addAddonsForProduct, addAddonsConditionsForProduct, updateProduct, deleteAddonsForProduct, getAllWaitlists, getWaitlistByProductId,
    getProductBySlug, getProductAddons, getTypeByProduct, getTypesWithProducts, getAllAddonsWithOptions, getAddonsWithOptions
}
