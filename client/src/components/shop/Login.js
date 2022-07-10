import React, {useContext, useEffect, useState} from 'react';
import {loginUser} from "../../helpers/auth";
import {ContentContext} from "../../App";
import Loader from "./Loader";

const Login = ({setFormType, fromCart, setUserLoggedIn}) => {
    const { language } = useContext(ContentContext);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(-1);

    const errors = [
        {
            pl: 'Wpisz swoją nazwę użytkownika lub adres e-mail',
            en: 'Fill your login or e-mail address'
        },
        {
            pl: "Wpisz swoje hasło",
            en: "Fill your password"
        },
        {
            pl: "Niepoprawna nazwa użytkownika lub hasło",
            en: "Wrong login or password"
        },
        {
            pl: 'Zweryfikuj swoje konto',
            en: 'Verify your account'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if(!login) {
            setError(0);
            setLoading(false);
        }
        else if(!password) {
            setError(1);
            setLoading(false);
        }
        else {
            loginUser(login, password)
                .then((res) => {
                    if(res?.data?.result) {
                        if(fromCart) {
                            setUserLoggedIn(true);
                        }
                        else {
                            window.location = '/panel-klienta';
                        }
                    }
                    else {
                        const msg = res?.data?.msg;
                        if(msg === 'verification') {
                            setError(3);
                        }
                        else {
                            setError(2);
                        }
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setError(2);
                    setLoading(false);
                });
        }
    }

    useEffect(() => {
        setError(-1);
    }, [login, password]);

    return <form className="form form--login">
        <label>
            <input className="input"
                   value={login}
                   onClick={() => { setError(-1); }}
                   onChange={(e) => { setLogin(e.target.value); }}
                   placeholder="Nazwa użytkownika lub e-mail" />
        </label>
        <label>
            <input className="input"
                   type="password"
                   value={password}
                   onClick={() => { setError(-1); }}
                   onChange={(e) => { setPassword(e.target.value); }}
                   placeholder="Hasło" />
        </label>
        <div className="form__addons flex">
            <label className="form__addons__label">
                <button className={rememberMe ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setRememberMe(!rememberMe); }}
                >
                </button>
                Zapamiętaj mnie
            </label>
            <a className="form__passwordReminder"
               href="/przypomnij-haslo">
                Przypomnij hasło
            </a>
        </div>

        {error !== -1 ? <span className="info info--error">
            {language === 'pl' ? errors[error].pl : errors[error].pl}
        </span> : ''}

        {!loading ? <button className="btn btn--submit"
                            onClick={(e) => { handleSubmit(e); } }>
            Zaloguj się
        </button> : <Loader />}

        <div className="form__additionalInfo center">
            <span className="form__additionalInfo__header">
                Nie posiadasz jeszcze konta?
            </span>
            <button type="button" className="form__additionalInfo__btn" onClick={() => { fromCart ? window.location = '/moje-konto' : setFormType(1); }}>
                Zarejestruj się
            </button>
        </div>

    </form>
};

export default Login;
