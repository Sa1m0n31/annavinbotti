import React, {useContext, useEffect, useState} from 'react';
import {registerUser} from "../../helpers/auth";
import {ContentContext} from "../../App";
import Loader from "./Loader";
import {isEmail} from "../../helpers/others";

const Register = () => {
    const { language } = useContext(ContentContext);

    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(-1);

    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);
    const [c3, setC3] = useState(false);

    const errors = [
        {
            pl: 'Wpisz swoją nazwę użytkownika',
            en: 'Fill your login or e-mail address'
        },
        {
            pl: 'Wpisz poprawny adres e-amil',
            en: 'Fill proper e-mail address'
        },
        {
            pl: 'Hasło powinno mieć co najmniej 8 znaków długości',
            en: 'Password is suppose to have at least 8 signs'
        },
        {
            pl: 'Podane hasła nie są identyczne',
            en: 'Password are not identical'
        },
        {
            pl: 'Uzupełnij wymagane zgody',
            en: 'Uzupełnij wymagane zgody'
        },
        {
            pl: 'Użytkownik o podanym adresie e-mail już istnieje',
            en: 'User with identical e-mail address already exists'
        },
        {
            pl: 'Uzytkownik o podanym loginie już istnieje',
            en: 'User with identical login already exists'
        },
        {
            pl: 'Coś poszło nie tak.. Prosimy spróbować później',
            en: 'Something went wrong... Please try again later'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if(!login) {
            setError(0);
            setLoading(false);
        }
        else if(!isEmail(email)) {
            setError(1);
            setLoading(false);
        }
        else if(password?.length < 8 || repeatPassword?.length < 8) {
            setError(2);
            setLoading(false);
        }
        else if(password !== repeatPassword) {
            setError(3);
            setLoading(false);
        }
        else if(!c1 || !c2) {
            setError(4);
            setLoading(false);
        }
        else {
            registerUser(login, email, password, c3 ? 'true' : 'false')
                .then((res) => {
                    const r = res?.data?.result;
                    if(r === 1) {
                        window.location = '/po-rejestracji';
                    }
                    else if(r === -1) {
                        setError(6);
                        setLoading(false);
                    }
                    else if(r === -2) {
                        setError(5);
                        setLoading(false);
                    }
                    else {
                        setError(7);
                        setLoading(false);
                    }
                })
                .catch(() => {
                   setError(7);
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
                   placeholder="Nazwa użytkownika" />
        </label>
        <label>
            <input className="input"
                   value={email}
                   onClick={() => { setError(-1); }}
                   onChange={(e) => { setEmail(e.target.value); }}
                   placeholder="Adres e-mail" />
        </label>
        <label>
            <input className="input"
                   type="password"
                   value={password}
                   onClick={() => { setError(-1); }}
                   onChange={(e) => { setPassword(e.target.value); }}
                   placeholder="Hasło" />
        </label>
        <label>
            <input className="input"
                   type="password"
                   value={repeatPassword}
                   onClick={() => { setError(-1); }}
                   onChange={(e) => { setRepeatPassword(e.target.value); }}
                   placeholder="Potwierdź hasło" />
        </label>

        <div className="consents">
            <label className="form__addons__label">
                <button className={c1 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC1(!c1); }}>

                </button>
                <span>
                    Wyrażam zgodę na przetwarzanie moich danych osobowych. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                </span>
            </label>
            <label className="form__addons__label">
                <button className={c2 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC2(!c2); }}>

                </button>
                <span>
                    Oświadczam, iż zapoznałem się z treścią Regulaminu i akceptuję jego postanowienia. Akceptuję również politykę prywatności
                </span>
            </label>
            <label className="form__addons__label">
                <button className={c3 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC3(!c3); }}>

                </button>
                <span>
                    Zapisz się do newslettera
                </span>
            </label>
        </div>

        {error !== -1 ? <span className="info info--error">
            {language === 'pl' ? errors[error].pl : errors[error].pl}
        </span> : ''}

        {!loading ? <button className="btn btn--submit"
                            onClick={(e) => { handleSubmit(e); } }>
            Utwórz konto
        </button> : <Loader />}
    </form>
};

export default Register;
