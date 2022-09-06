import React, {useContext, useEffect, useState} from 'react';
import {registerUser} from "../../helpers/auth";
import {ContentContext} from "../../App";
import Loader from "./Loader";
import {isEmail} from "../../helpers/others";

const Register = () => {
    const { language } = useContext(ContentContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(-1);

    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);

    const errors = [
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

        if(!isEmail(email)) {
            setError(0);
            setLoading(false);
        }
        else if(password?.length < 8 || repeatPassword?.length < 8) {
            setError(1);
            setLoading(false);
        }
        else if(password !== repeatPassword) {
            setError(2);
            setLoading(false);
        }
        else if(!c1) {
            setError(3);
            setLoading(false);
        }
        else {
            registerUser(email, password, c2 ? 'true' : 'false')
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
    }, [password]);

    return <form className="form form--login">
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
                   placeholder="Powtórz hasło" />
        </label>

        <div className="consents">
            <label className="form__addons__label">
                <button className={c1 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC1(!c1); }}>
                    <span></span>
                </button>
                <span className="checkboxText">
                    Oświadczam, że zapoznałem/-am się z <a href="/regulamin" target="_blank">Regulaminem</a> i <a href="/polityka-prywatnosci" target="_blank">Polityką prywatności</a>
                    oraz akceptuję ich postanowienia. *
                </span>
            </label>
            <label className="form__addons__label">
                <button className={c2 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC2(!c2); }}>
                    <span></span>
                </button>
                <span>
                    Wyrażam zgodę na otrzymywanie informacji handlowych dotyczących bieżącej działalności sklepu Anna Vinbotti oraz aktualności ze świata mody, przesyłanych przez firmę „Anna Kot” pod podany przeze mnie adres poczty elektronicznej.
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
