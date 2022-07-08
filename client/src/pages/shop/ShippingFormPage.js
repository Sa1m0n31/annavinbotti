import React, {useContext, useEffect, useRef, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {CartContext, ContentContext} from "../../App";
import CartContent from "../../components/shop/CartContent";
import OrderForm from "../../components/shop/OrderForm";
import OrderReceived from "../../components/shop/OrderReceived";

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
    const { cartContent } = useContext(CartContext);

    const [orderStep, setOrderStep] = useState(localStorage.getItem('orderStep') ? parseInt(localStorage.getItem('orderStep')) : 0);
    const [orderStepDisplay, setOrderStepDisplay] = useState(0);

    const orderProgress = useRef(null);
    const orderContent = useRef(null);

    useEffect(() => {
        if(cartContent && cartContent?.length) {
            if(orderStep === 0) {
                orderProgress.current.style.width = '30%';
            }
            else if(orderStep === 1) {
                orderProgress.current.style.width = '63%';
            }
            else if(orderStep === 2) {
                orderProgress.current.style.width = '100%';
            }
        }
    }, [cartContent, orderStep]);

    useEffect(() => {
        if(orderStep === 0) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        orderContent.current.style.opacity = '0';
        setTimeout(() => {
            setOrderStepDisplay(orderStep);
            setTimeout(() => {
                orderContent.current.style.opacity = '1';
            }, 100);
        }, 500);
    }, [orderStep]);

    return <div className="container container--order">
        <PageHeader />
        <main className="order w">

            {!cartContent || cartContent?.length === 0 ? <div className="emptyCart">
                <h2 className="emptyCart__header">
                    Twój koszyk jest pusty
                </h2>
                <a href="/sklep" className="btn btn--backToShop">
                    Wróć do sklepu
                </a>
            </div> : <>
                <header className="order__header">
                    <h1 className="order__header__h1">
                        {language === 'pl' ? stepHeaders[orderStep].pl : stepHeaders[orderStep].en}
                    </h1>
                    <div className="order__header__steps order__header__steps--mobile flex d-mobile">
                        <span>
                            01
                        </span>
                        <span>
                            02
                        </span>
                        <span>
                            03
                        </span>
                    </div>

                    <div className="order__header__steps flex d-desktop">
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

                <div className="orderContent" ref={orderContent}>
                    {orderStepDisplay === 0 ? <CartContent nextStep={() => { setOrderStep(1); }} /> :
                        (orderStepDisplay === 1 ? <OrderForm backToCart={() => { setOrderStep(0); }} /> : <OrderReceived />)}
                </div>
            </>}
        </main>
        <Footer />
    </div>
};

export default ShippingFormPage;
