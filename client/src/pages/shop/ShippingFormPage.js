import React, {useContext, useEffect, useRef, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {ContentContext} from "../../App";
import CartContent from "../../components/shop/CartContent";

const stepHeaders = [
    {
        pl: 'Koszyk',
        en: 'Cart'
    },
    {
        pl: 'Dane zamówienia',
        en: 'Order data'
    },
    {
        pl: 'Potwierdzenie',
        en: 'Final'
    }
];

const ShippingFormPage = () => {
    const { content, language } = useContext(ContentContext);

    const [orderStep, setOrderStep] = useState(localStorage.getItem('orderStep') ? parseInt(localStorage.getItem('orderStep')) : 0);

    const orderProgress = useRef(null);

    useEffect(() => {
        if(orderStep === 0) {
            orderProgress.current.style.width = '30%';
        }
        else if(orderStep === 1) {
            orderProgress.current.style.width = '63%';
        }
        else if(orderStep === 2) {
            orderProgress.current.style.width = '100%';
        }
    }, [orderStep]);

    return <div className="container container--order">
        <PageHeader />
        <main className="order w">
            <header className="order__header">
                <h1 className="order__header__h1">
                    {language === 'pl' ? stepHeaders[orderStep].pl : stepHeaders[orderStep].en}
                </h1>
                <div className="order__header__steps flex">
                    <h2 className="order__header__steps__item">
                        <span>
                            01
                        </span>
                        {language === 'pl' ? stepHeaders[0].pl : stepHeaders[0].en}
                    </h2>
                    <h2 className="order__header__steps__item">
                        <span>
                            02
                        </span>
                        {language === 'pl' ? stepHeaders[1].pl : stepHeaders[1].en}
                    </h2>
                    <h2 className="order__header__steps__item">
                        <span>
                            03
                        </span>
                        {language === 'pl' ? stepHeaders[2].pl : stepHeaders[2].en}
                    </h2>
                </div>

                <div className="order__header__progress">
                    <div className="order__header__progress__inner" ref={orderProgress}>

                    </div>
                </div>
            </header>

            {orderStep === 0 ? <CartContent /> : (orderStep === 1 ? '' : '')}
        </main>
        <Footer />
    </div>
};

export default ShippingFormPage;
