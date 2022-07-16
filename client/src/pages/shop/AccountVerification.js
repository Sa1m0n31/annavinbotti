import React, {useEffect, useState} from 'react';
import {verifyAccount} from "../../helpers/user";
import LoadingPage from "../../components/shop/LoadingPage";
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";

const AccountVerification = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(token) {
            verifyAccount(token)
                .then((res) => {
                    if(res?.status === 201) {
                        setRender(true);
                    }
                    else {
                        window.location = '/';
                    }
                })
        }
        else {
            window.location = '/';
        }
    }, []);

    return !render ? <LoadingPage /> : <div className="container">
        <PageHeader />

        <main className="remindPassword verificationPage w">
            <h1 className="shipping__header">
                Twoje konto zostało pomyślnie zweryfikowane!
            </h1>
            <a className="btn btn--remindPassword btn--verification" href="/">
                Wróć na stronę główną
            </a>
        </main>

        <Footer />
    </div>
};

export default AccountVerification;
