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
    const [c1, setC1] = useState(false);

    useEffect(() => {
        setStatus(0);
    }, [c1]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if(isEmail(email) && name && message && c1) {
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
                        tel: +48 570 272 901<br/>
                        (Obsługiwany od poniedziałku do piątku w godzinach 10:00 - 14:00)
                    </p>
                </div>
                <div className="contact__top__section">
                    <h2 className="contact__top__section__header">
                        Adres do korespondencji
                    </h2>
                    <p className="contact__top__section__data">
                        Sklep Anna Vinbotti
                    </p>
                    <p className="contact__top__section__data">
                        Ul. Tomasza Zana 43 / lok. 2.1
                    </p>
                    <p className="contact__top__section__data">
                        20 – 601 Lublin
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

                <div className="formSection__checkbox">
                    <label className="form__addons__label">
                        <button className={c1 ? "form__check form__check--selected" : "form__check"}
                                type="button"
                                onClick={() => { setC1(!c1); }}>
                            <span></span>
                        </button>
                        <span className="checkboxText">
                        Oświadczam, że zapoznałem/-am się z <a href="/polityka-prywatnosci" target="_blank">Polityką prywatności</a> *
                    </span>
                    </label>
                </div>

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
