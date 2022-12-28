import React, {useContext, useEffect, useState} from 'react';
import {isEmail} from "../../helpers/others";
import {ContentContext} from "../../App";
import {registerToNewsletter} from "../../helpers/newsletter";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);
    const [status, setStatus] = useState("");

    const { language, content } = useContext(ContentContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!c1 || !c2) {
            setError('Uzupełnij wymagane zgody');
        }
        else {
            if(isEmail(email)) {
                registerToNewsletter(email)
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(language === 'pl' ? 'Dziękujemy za zapisanie się do newslettera! Na podany adres e-mail został wysłany link aktywacyjny. W przypadku braku wiadomości w skrzynce, sprawdź folder spam.' : 'Thank you for subscribing to the newsletter! An activation link has been sent to the e-mail address provided.');
                        }
                        else {
                            setError(language === 'pl' ? 'Podany adres jest już zapisany do naszego newslettera' : 'Email address already registered to our newsletter');
                        }
                    })
                    .catch((err) => {
                        if(err?.response?.status === 400) {
                            setError(language === 'pl' ? 'Podany adres jest już zapisany do naszego newslettera' : 'Email address already registered to our newsletter');
                        }
                        else {
                            setError(language === 'pl' ? 'Coś poszło nie tak. Prosimy spróbować później' : 'Something goes wrong. Please try again later');
                        }
                    })
            }
            else {
                setError(language === 'pl' ? 'Wpisz poprawny adres e-mail' : 'Fill e-mail input');
            }
        }
    }

    useEffect(() => {
        if(error) {
            setTimeout(() => {
                setError("");
            }, 2000);
        }
    }, [error]);

    return <div className="newsletterSection">
        <h3 className="newsletter__header">
            Chcesz być na bieżąco ze światem Anna Vinbotti?
        </h3>
        <h4 className="newsletter__subheader">
            Zapraszamy do zapisu na nasz newsletter
        </h4>
        {!status && !error ? <div className="newsletter__form">
            <label>
                <input className="input input--client input--newsletter"
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }}
                       placeholder="Twój adres email" />
            </label>
            <button className="btn btn--newsletter"
                    onClick={(e) => { handleSubmit(e); }}>
                Dołącz
            </button>
        </div> : (status ? <span className="info info--success">
            {status}
        </span> : <span className="info info--error">
            {error}
        </span>)}

        {!status && !error ? <div className="formSection__checkbox formSection__checkbox--newsletter">
            <label className="form__addons__label">
                <button className={c1 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC1(!c1); }}>
                    <span></span>
                </button>
                <span className="checkboxText">
                        Oświadczam, że zapoznałem/-am się z <a href="/regulamin" target="_blank">Regulaminem</a> i <a href="/polityka-prywatnosci" target="_blank">Polityką prywatności</a> oraz akceptuję ich postanowienia *
                    </span>
            </label>

            <label className="form__addons__label">
                <button className={c2 ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setC2(!c2); }}>
                    <span></span>
                </button>
                <span className="checkboxText">
                        Wyrażam zgodę na otrzymywanie informacji handlowych dotyczących bieżącej działalności sklepu Anna Vinbotti oraz aktualności ze świata mody, przesyłanych przez firmę „Anna Kot” pod podany przeze mnie adres poczty elektronicznej. *
                </span>
            </label>
        </div> : ''}
    </div>
};

export default NewsletterSection;
