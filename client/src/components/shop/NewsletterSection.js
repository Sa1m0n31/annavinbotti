import React, {useContext, useEffect, useState} from 'react';
import {isEmail} from "../../helpers/others";
import {ContentContext} from "../../App";
import {registerToNewsletter} from "../../helpers/newsletter";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");

    const { language, content } = useContext(ContentContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(isEmail(email)) {
            registerToNewsletter(email)
                .then((res) => {
                    if(res?.status === 201) {
                        setStatus(language === 'pl' ? 'Dziękujemy za zapisanie się do newslettera! Na podany adres e-mail został wysłany link aktywacyjny.' : 'Thank you for subscribing to the newsletter! An activation link has been sent to the e-mail address provided.');
                    }
                    else {
                        setError(language === 'pl' ? 'Podany adres jest już zapisany do naszego newslettera' : 'Email address already registered to our newsletter');
                    }
                })
                .catch((err) => {
                    setError(language === 'pl' ? 'Coś poszło nie tak. Prosimy spróbować później' : 'Something goes wrong. Please try again later');
                })
        }
        else {
            setError(language === 'pl' ? 'Wpisz poprawny adres e-mail' : 'Fill e-mail input');
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
    </div>
};

export default NewsletterSection;
