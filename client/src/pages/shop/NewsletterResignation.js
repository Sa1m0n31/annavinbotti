import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {deleteFromNewsletter, sendResignationLink, verifyNewsletter} from "../../helpers/newsletter";
import LoadingPage from "../../components/shop/LoadingPage";
import {isEmail} from "../../helpers/others";
import Loader from "../../components/shop/Loader";

const NewsletterResignation = () => {
    const [render, setRender] = useState(false);
    const [email, setEmail] = useState('');
    const [inputActive, setInputActive] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(token) {
            deleteFromNewsletter(token)
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
            setInputActive(true);
            setRender(true);
        }
    }, []);

    useEffect(() => {
        setError('');
    }, [email]);

    const sendDeleteLink = () => {
        if(isEmail(email)) {
            setLoading(true);
            sendResignationLink(email)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    setLoading(false);
                })
                .catch((err) => {
                   if(err?.response?.status === 400) {
                       setError('Podany adres e-mail nie jest zapisany do newslettera');
                   }
                   else {
                       setError('Coś poszło nie tak... Prosimy spróbować później');
                   }
                   setLoading(false);
                });
        }
        else {
            setError('Wpisz poprawny adres e-mail');
        }
    }

    return !render ? <LoadingPage /> : <div className="container">
        <PageHeader />
        {!inputActive ? <main className="newsletterPage newPasswordForm w">
            <h2 className="shipping__header">
                Pomyślnie wypisano Twój adres e-mail z newslettera.
            </h2>
            <a className="btn btn--remindPassword btn--remindPassword--success" href="/">
                Wróć na stronę główną
            </a>
        </main> : <main className="newsletterPage newsletterPage--resignation newPasswordForm w">
            {success ? <>
                <h2 className="shipping__header shipping__header--newsletterResignation shipping__header--afterResignationLinkSend">
                    Na podany adres e-mail wysłaliśmy link z potwierdzeniem rezygnacji z newslettera. W przypadku braku wiadomości w skrzynce, sprawdź folder spam.
                </h2>
                <a className="btn btn--remindPassword btn--remindPassword--success" href="/">
                    Wróć na stronę główną
                </a>
            </> : <>
                <h2 className="shipping__header shipping__header--newsletterResignation">
                    Podaj adres e-mail, który chcesz wypisać z newslettera.
                </h2>
                <label className="label label--newsletterResignation">
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }}
                           placeholder="Twój e-mail" />
                </label>

                {error ? <span className="info info--error">
                {error}
            </span> : ''}

                {!loading ? <button className="btn btn--newsletter btn--newsletterResignation"
                                    onClick={() => { sendDeleteLink(); }}>
                    Usuń mnie z newslettera
                </button> : <div className="center">
                    <Loader />
                </div>}
            </>}
        </main>}
        <Footer />
    </div>
};

export default NewsletterResignation;
