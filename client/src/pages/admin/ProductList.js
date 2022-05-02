import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {getAllProducts} from "../../helpers/products";
import ProductListItem from "../../components/admin/ProductListItem";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProducts()
            .then((res) => {
               if(res.status === 200) {
                   setProducts(res?.data?.result);
               }
               else {
                   window.location = '/';
               }
            })
            .catch(() => {
                window.location = '/';
            });
    }, []);

    return <div className="container container--admin">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={1} />
            <main className="admin__main">
                {products?.map((item, index) => {
                    return <ProductListItem index={index} />
                })}
            </main>
        </div>
    </div>
};

export default ProductList;
