import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import ShopContent from "../../components/shop/ShopContent";
import {Helmet} from "react-helmet";

const Shop = () => {
    return <>
        <Helmet>
            <title>Anna Vinbotti - wszystkie produkty</title>
            <meta name="description" content="Marka Anna Vinbotti została stworzona na bazie niekończącej się pasji do obuwia oraz historii mody. Przywołuje nostalgię za czasami, które aktualnie możemy oglądać już tylko na starych zdjęciach. Powstała po to, aby móc, chociaż częściowo wskrzesić powab dawnego, tradycyjnego szewskiego rzemiosła." />
        </Helmet>
        <div className="container">
            <PageHeader />
            <ShopContent />
            <Footer />
        </div>
    </>
};

export default Shop;
