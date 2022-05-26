import axios from "axios";

const getAllStocks = () => {
    return axios.get(`/stocks/get-all-stocks`);
}

const getAllProductStocks = () => {
    return axios.get('/stocks/get-all-products-stocks');
}

const getAllAddonsStocks = () => {
    return axios.get('/stocks/get-all-addons-stocks');
}

const deleteProductStock = (id) => {
    return axios.delete('/stocks/delete-product-stock', {
        params: {
            id
        }
    });
}

const deleteAddonStock = (id) => {
    return axios.delete('/stocks/delete-addon-stock', {
        params: {
            id
        }
    });
}

const getProductStockDetails = (id) => {
    return axios.get('/stocks/get-product-stock-details', {
        params: {
            id
        }
    });
}

const getAddonStockDetails = (id) => {
    return axios.get('/stocks/get-addon-stock-details', {
        params: {
            id
        }
    });
}

const addProductStock = (stockName, counter, products) => {
    return axios.post('/stocks/add-product-stock', {
       stockName,
       counter,
       products: JSON.stringify(products)
    });
}

const addAddonStock = (stockName, counter, addonsOptions) => {
    return axios.post('/stocks/add-addons-stock', {
        stockName,
        counter,
        addonsOptions: JSON.stringify(addonsOptions)
    });
}

export { getAllStocks, getAllProductStocks, getAllAddonsStocks, deleteProductStock, deleteAddonStock,
    getProductStockDetails, getAddonStockDetails, addProductStock, addAddonStock
}
