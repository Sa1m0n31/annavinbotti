import React, {useContext, useEffect, useRef, useState} from 'react';
import Loader from "../shop/Loader";
import {isEmail} from "../../helpers/others";
import {addToWaitlist} from "../../helpers/orders";
import constans from "../../helpers/constants";
import {LanguageContext} from "../../App";

const WaitlistModal = ({id, closeModalFunction}) => {
    const headerRef = useRef(null);
    const btnRef = useRef(null);

    const { language } = useContext(LanguageContext);

    const [email, setEmail] = useState('');
    const [c1, setC1] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.addEventListener('keyup', (event) => {
            if(event.keyCode === 27) {
                closeModalFunction();
            }
        });
    }, []);

    useEffect(() => {
        setError('');
    }, [c1]);

    const handleWaitlistRegister = () => {
        if(isEmail(email)) {
            if(c1) {
                setLoading(true);
                addToWaitlist(id, email)
                    .then((res) => {
                        if(res?.status === 201) {
                            setSuccess(true);
                        }
                        else {
                            if(res?.data?.result === -1) {
                                setError(language === 'pl' ? 'Podany adres e-mail jest już zapisany na tę listę kolejkową'
                                    : 'That email is already on waitlist');
                            }
                            else {
                                setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN)
                            }
                        }
                        setLoading(false);
                    })
                    .catch(() => {
                        setLoading(false);
                        setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                    })
            }
            else {
                setError('Zaznacz wymagane zgody');
            }
        }
        else {
            setError('Wpisz poprawny adres e-mail');
        }
    }

    return <div className="colorModal colorModal--waitlist">
        <div className="colorModal__inner">
            <button className="colorModal__close" onClick={() => { closeModalFunction(); }}>
                &times;
            </button>

            {!success ? <>
                <h3 className="colorModal__header colorModal__header--waitlist" ref={headerRef}>
                    Powiadomimy Cię mailowo, gry produkt będzie ponownie dostępny
                </h3>
                    <label>
                    <input className="input"
                           value={email}
                           onClick={() => { setError(''); }}
                           onChange={(e) => { setError(''); setEmail(e.target.value); }}
                           placeholder="Adres e-mail" />
                </label>
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

                {error ? <span className="info info--error">
                {error}
            </span> : ''}

                <button className={loading ? "btn btn--changeColor hidden" : (error ? "btn btn--changeColor btn--marginTop" : "btn btn--changeColor")}
                                    onClick={() => { handleWaitlistRegister(); }}>
                    Powiadom o dostępności
                </button>

                {loading ? <div className="center">
                    <Loader />
                </div> : ''}
            </> : <>
                <h3 className="colorModal__header colorModal__header--success">
                    Dziękujemy za zapisanie się na listę kolejkową
                </h3>
                <span className="info info--success">
                    Poinformujemy Cię, gdy produkt będzie dostępny.
                </span>
                <button className="btn btn--changeColor btn--success"
                        onClick={() => { closeModalFunction(); }}>
                    Wróć do sklepu
                </button>
            </>}
        </div>
    </div>
};

export default WaitlistModal;
