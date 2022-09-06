import axios from "axios";

const checkAddonsStocks = (options, stock) => {
    return axios.get('/stocks/check-addons-stocks', {
        params: {
            options, stock
        }
    });
}

const checkProductsStocks = (products, stock) => {
    return axios.get('/stocks/check-products-stocks', {
        params: {
            products, stock
        }
    });
}

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

const getProductStock = (id) => {
    return axios.get('/stocks/get-product-stock', {
        params: {
            id
        }
    });
}

const decrementStockByProduct = (product, decrement) => {
    return axios.put('/stocks/decrement-stock-by-product', {
        product, decrement
    });
}

const decrementStockByAddon = (addonOption, decrement) => {
    return axios.put('/stocks/decrement-stock-by-addon', {
        addonOption, decrement
    });
}

const updateAddonStock = (id, stock) => {
    return axios.patch('/stocks/update-addon-stock', {
        id, stock
    });
}

export { getAllStocks, getAllProductStocks, getAllAddonsStocks, deleteProductStock, deleteAddonStock,
    getProductStockDetails, getAddonStockDetails, addProductStock, addAddonStock, checkAddonsStocks, checkProductsStocks,
    getProductStock, decrementStockByAddon, decrementStockByProduct, updateAddonStock
}
