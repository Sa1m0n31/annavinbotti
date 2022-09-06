import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {verifyNewsletter} from "../../helpers/newsletter";
import LoadingPage from "../../components/shop/LoadingPage";

const NewsletterVerification = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(token) {
            verifyNewsletter(token)
                .then((res) => {
                    if(res?.status === 201) {
                        setRender(true);
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch((err) => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    return !render ? <LoadingPage /> : <div className="container">
        <PageHeader />
        <main className="newsletterPage newPasswordForm w">
            <h2 className="shipping__header">
                Udało się!
            </h2>
            <p className="remindPassword__text remindPassword__text--success">
                Weryfikacja przebiegła pomyślnie! Dziękujemy za zapisanie się do naszego newslettera.
            </p>
            <a className="btn btn--remindPassword btn--remindPassword--success" href="/">
                Wróć na stronę główną
            </a>
        </main>
        <Footer />
    </div>
};

export default NewsletterVerification;
