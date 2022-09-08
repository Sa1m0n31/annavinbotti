import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";

const AfterRegister = () => {
    return <div className="container">
        <PageHeader />

        <main className="remindPassword w">
            <h1 className="shipping__header">
                Twoje konto zostało założone
            </h1>
            <p className="remindPassword__text remindPassword__text--success">
                Na Twój adres mailowy wysłaliśmy link do weryfikacji Twojego konta. Jeśli mail nie dotarł, prosimy sprawdzić również folder spam.
            </p>
            <a className="btn btn--remindPassword btn--remindPassword--success" href="/">
                Wróć na stronę główną
            </a>
        </main>

        <Footer />
    </div>
};

export default AfterRegister;
