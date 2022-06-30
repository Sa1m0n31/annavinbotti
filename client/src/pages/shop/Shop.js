import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import ShopContent from "../../components/shop/ShopContent";

const Shop = () => {
    return <div className="container">
        <PageHeader />
        <ShopContent />
        <Footer />
    </div>
};

export default Shop;
