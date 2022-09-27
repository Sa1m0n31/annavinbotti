import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {ContentContext} from "../../App";
import {getOrderById, payOrder} from "../../helpers/orders";
import Loader from "../../components/shop/Loader";
import {getUserInfo} from "../../helpers/user";
import constans from "../../helpers/constants";

const paymentMethods = [
    {
        pl: 'Płatności internetowe (przelew internetowy, BLIK, automatyczny przelew tradycyjny)',
        en: 'Online payment'
    }
]

const PaymentPage = () => {
    const { language } = useContext(ContentContext);

    const [render, setRender] = useState(false);
    const [payment, setPayment] = useState(0);
    const [orderId, setOrderId] = useState(null);
    const [traditionalTransfer, setTraditionalTransfer] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState({});

    useEffect(() => {
        const id = new URLSearchParams(window.location.search)?.get('id');

        getUserInfo()
            .then((res) => {
                if(res?.status === 200) {
                    const r = res?.data?.result[0];
                    setUser({
                        firstName: r.first_name,
                        lastName: r.last_name,
                        email: r.email
                    });
                }
                else {
                    window.location = '/';
                }
            })
            .catch(() => {
                window.location = '/';
            });

        if(id) {
            getOrderById(id)
                .then((res) => {
                    const status = res?.data?.result[0]?.status;

                    if(status === 3) {
                        setOrderId(id);
                        setRender(true);
                    }
                    else {
                        window.location = '/';
                    }
                });
        }
        else {
            window.location = '/';
        }
    }, [])

    const pay = () => {
        payOrder(orderId, payment, user.firstName, user.lastName, user.email)
            .then((res) => {
                if(payment === 0) {
                    // imoje - online payment
                    if(res?.data?.id) {
                        window.location = `${constans.PAYMENT_LINK}${res?.data?.id}`;
                    }
                }
                else if(payment === 1) {
                    // traditional transfer
                    if(res?.status === 201) {
                        setTraditionalTransfer(true);
                    }
                }
            })
            .catch((err) => {
                if(err?.response?.data?.code === "ERR_NON_2XX_3XX_RESPONSE") {
                    setError('Uzupełnij swoje imię i nazwisko w ustawieniach profilu');
                }
                else {
                    setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                }
            });
    }

    return <div className="container">
        <PageHeader />

        {render ? <main className="payment w">
            <h1 className="pageHeader">
                Opłać zamówiene
            </h1>
            <h2 className="payment__text">
                <span>
                    Zamówienie:
                </span>
                #{orderId}
            </h2>

            {traditionalTransfer ? <div className="traditionalTransfer">
                <h3 className="shipping__header">
                    Dane do przelewu
                </h3>
                <p className="transferData">
                    Nazwa firmy: Anna Kot<br/>
                    Numer konta: 50 5000 5000 5000 5000 500<br/>
                    Tytuł przelewu: #{orderId}
                </p>
                <p className="transferData">
                    Status Twojego zamówienia zostanie zmieniony po zaksięgowaniu płatności
                </p>
            </div> : <div className="shipping">
                <h3 className="shipping__header">
                    Wybierz formę płatności
                </h3>
                {paymentMethods.map((item, index) => {
                    return <button className={payment === index ? "shipping__method shipping__method--selected" : "shipping__method"}
                                   onClick={() => { setPayment(index); }}>
                        <span className="shipping__method__left">
                            <span className="shipping__method__circle">

                            </span>
                            <span className="shipping__method__name">
                                {language === 'pl' ? item.pl : item.en}
                            </span>
                        </span>
                    </button>
                })}

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                <button className="btn btn--sendForm" onClick={() => { pay(); }}>
                    Zamawiam i płacę
                </button>
            </div>}
        </main> : <div className="center marginTop">
            <Loader />
        </div> }

        <Footer />
    </div>
};

export default PaymentPage;
