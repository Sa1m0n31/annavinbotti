import React, {useEffect} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";

const FormType1 = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const order = params.get('zamowienie');
        const type = params.get('typ');

        if(order && type) {
            
        }
        else {
            window.location = '/';
        }
    }, []);

    return <div className="container">
        <PageHeader />



        <Footer />
    </div>
};

export default FormType1;
