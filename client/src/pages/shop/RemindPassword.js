import React, {useContext, useEffect, useRef, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {ContentContext} from "../../App";
import {isEmail} from "../../helpers/others";
import {remindPassword} from "../../helpers/user";
import constans from "../../helpers/constants";
import Loader from "../../components/shop/Loader";

const RemindPassword = () => {
    const { language } = useContext(ContentContext);

    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const container = useRef(null);

    const sendLink = () => {
        if(isEmail(email)) {
            setLoading(true);
            remindPassword(email)
                .then((res) => {
                    if(res?.data?.result === 0) {
                        setError(language === 'pl' ? 'Nie znaleziono użytkownika o podanym adresie e-mail' : 'Nie znaleziono użytkownika o podanym adresie e-mail');
                    }
                    else if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                    }
                });
        }
        else {
            setError(language === 'pl' ? 'Podaj poprawny adres e-mail' : 'Fill the input with valid e-mail');
        }
    }

    useEffect(() => {
        if(error || success) {
            setLoading(false);
        }
    }, [error, success]);

    return <div className="container">
        <PageHeader />
        <main className="remindPassword w" ref={container}>
            {!success ? <>
                <h2 className="shipping__header">
                    Przypomij hasło
                </h2>
                <p className="remindPassword__text">
                    Zapomniałeś hasła? Wpisz swój adres e-mail, a my wyślemy Ci link do ustawienia nowego hasła.
                </p>
                <label>
                    Adres e-mail
                    <input className="input"
                           value={email}
                           onFocus={() => { setError(''); }}
                           onChange={(e) => { setEmail(e.target.value); }}
                    />
                </label>

                {error ? <span className="info info--error">
                    {error}
            </span> : ''}

                {!loading ? <button className="btn btn--remindPassword" onClick={() => { sendLink(); }}>
                    Przypomij hasło
                </button> : <div className="center marginTop">
                    <Loader />
                </div>}
            </> : <>
                <h2 className="shipping__header">
                    Udało się!
                </h2>
                <p className="remindPassword__text remindPassword__text--success">
                    Na Twój adres mailowy wysłaliśmy link do ustawienia nowego hasła.
                </p>
                <a className="btn btn--remindPassword btn--remindPassword--success" href="/">
                    Wróć na stronę główną
                </a>
            </>}
        </main>
        <Footer />
    </div>
};

export default RemindPassword;
