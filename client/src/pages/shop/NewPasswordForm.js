import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {changePassword, verifyAccount, verifyPasswordToken} from "../../helpers/user";
import LoadingPage from "../../components/shop/LoadingPage";
import {isPasswordStrong} from "../../helpers/others";
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import Loader from "../../components/shop/Loader";

const NewPasswordForm = () => {
    const { language } = useContext(ContentContext);

    const [render, setRender] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(token) {
            verifyPasswordToken(token)
                .then((res) => {
                    if(res?.status === 200) {
                        setEmail(res?.data?.email);
                        setRender(true);
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    const updatePassword = (e) => {
        e.preventDefault();

        if(!isPasswordStrong(password)) {
            setError('Hasło powinno mieć co najmniej 8 znaków');
        }
        else if(password !== repeatPassword) {
            setError('Podane hasła nie są identyczne');
        }
        else {
            setLoading(true);
            changePassword(email, password)
                .then((res) => {
                    if(res?.status === 201) {
                        setSuccess(true);
                    }
                    else {
                        setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                    }
                })
                .catch(() => {
                    setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                });
        }
    }

    useEffect(() => {
        if(success || error) {
            setLoading(false);
        }
    }, [success, error]);

    return !render ? <LoadingPage /> : <div className="container">
        <PageHeader />
        <main className="newPasswordForm w">
            {!success ? <>
                <h1 className="shipping__header">
                    Ustaw nowe hasło do swojego konta
                </h1>
                <form className="newPasswordForm__form">
                    <label>
                        <input className="input"
                               type="password"
                               value={password}
                               onFocus={() => { setError(''); }}
                               onChange={(e) => { setPassword(e.target.value); }}
                               placeholder="Hasło" />
                    </label>
                    <label>
                        <input className="input"
                               type="password"
                               value={repeatPassword}
                               onFocus={() => { setError(''); }}
                               onChange={(e) => { setRepeatPassword(e.target.value); }}
                               placeholder="Potwierdź hasło" />
                    </label>

                    {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                    {!loading ? <button className="btn btn--submit"
                                        onClick={(e) => { updatePassword(e); } }>
                        Zmień hasło
                    </button> : <div className="center marginTop">
                        <Loader />
                    </div>}
                </form>
            </> : <>
                <h2 className="shipping__header">
                    Udało się!
                </h2>
                <p className="remindPassword__text remindPassword__text--passwordForm">
                    Twoje hasło zostało zmienione.
                </p>
                <a className="btn btn--remindPassword btn--remindPassword--passwordForm" href="/">
                    Wróć na stronę główną
                </a>
            </>}
        </main>
        <Footer />
    </div>
};

export default NewPasswordForm;
