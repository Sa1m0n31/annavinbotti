import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {isEmail, sendContactForm} from "../../helpers/others";
import Loader from "../../components/shop/Loader";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const ContactPage = () => {
    const { language } = useContext(ContentContext);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if(isEmail(email) && name && message) {
            sendContactForm(name, email, message)
                .then((res) => {
                    if(res?.status === 201) {
                        setLoading(false);
                        setStatus(1);
                    }
                    else {
                        setLoading(false);
                        setStatus(-2);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setStatus(-2);
                });
        }
        else {
            setLoading(false);
            setStatus(-1);
        }
    }

    useEffect(() => {
        if(status === 1) {
            setName('');
            setEmail('');
            setMessage('');
        }
    }, [status]);

    return <div className="container">
        <PageHeader />

        <main className="contact w">
            <div className="contact__top flex">
                <div className="contact__top__section">
                    <h2 className="contact__top__section__header">
                        Kontakt
                    </h2>
                    <p className="contact__top__section__data">
                        office@anna-vinbotti.com
                    </p>
                    <p className="contact__top__section__data contact__top__section__data--phone">
                        tel: +48 239 329 321<br/>
                        Obsługiwany od poniedziałku do piątku w godzinach 8:00 - 16:00
                    </p>
                </div>
                <div className="contact__top__section">
                    <h2 className="contact__top__section__header">
                        Adres do korespondencji
                    </h2>
                    <p className="contact__top__section__data">
                        ul. Polna 13/9
                    </p>
                    <p className="contact__top__section__data">
                        50-103 Warszawa
                    </p>
                </div>
            </div>

            <div className="contact__bottom">
                <h3 className="contact__bottom__header">
                    Napisz do nas
                </h3>
                <label>
                    Imię *
                    <input className="input"
                           value={name}
                           onChange={(e) => { setName(e.target.value); }} />
                </label>
                <label>
                    Adres e-mail *
                    <input className="input"
                           value={email}
                           onChange={(e) => { setEmail(e.target.value); }} />
                </label>
                <label>
                    Treść wiadomości *
                    <textarea className="input input--textarea"
                              value={message}
                              onChange={(e) => { setMessage(e.target.value); }} />
                </label>
                {loading ? <div className="center marginTop">
                    <Loader />
                </div> : (status === 1 ? <span className="info">
                    Dziękujemy za wiadomość. Odpowiemy najszybciej jak to możliwe.
                </span> : (status === -1 ? <span className="info info--error">
                    Uzupełnij wymagane pola
                </span> : (status === -2 ? <span className="info info--error">
                    {language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN}
                </span> : '')))}

                {!loading ? <button className="btn btn--sendForm" onClick={(e) => { handleSubmit(e); }}>
                    Wyślij
                </button> : ''}
            </div>
        </main>

        <Footer />
    </div>
};

export default ContactPage;
