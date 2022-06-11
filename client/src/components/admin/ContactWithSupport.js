import React, {useEffect, useState} from 'react';
import {sendMessageToSupport} from "../../helpers/others";
import Waiting from "./Loader";

const ContactWithSupport = () => {
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if(content) {
            setLoading(true);
            sendMessageToSupport(content)
                .then((res) => {
                    if(res?.status === 201) {
                        setStatus(1);
                    }
                    else {
                        setStatus(-2);
                    }
                })
                .catch(() => { setStatus(-2); })
        }
        else {
            setStatus(-1);
        }
    }

    useEffect(() => {
        if(status) {
            setContent("");
            setLoading(false);
            setTimeout(() => {
                setStatus(0);
            }, 2500);
        }
    }, [status]);

    return <div className="admin__start__section admin__start__section--100">
        <h3 className="admin__start__section__header">
            Kontakt z supportem
        </h3>
        <p className="contactWithSupportText">
            Masz pytanie odnośnie działania panelu administracyjnego lub problem techniczny? Opisz swój problem i skontaktuj się z naszym wsparciem technicznym. Odpowiemy najszybciej jak to możliwe na Twój adres mailowy (kot.annamaria@yahoo.com).
        </p>
        {!status ? <div className="admin__start__statsWrapper">
            <textarea className="admin__contact__textarea"
                      placeholder="Tu wpisz swoje pytanie do wsparcia technicznego"
                      value={content}
                      onChange={(e) => { setContent(e.target.value); }} />

            {loading ? <Waiting /> : <button className="btn btn--admin btn--admin--contact" onClick={() => { handleSubmit() }}>
                Wyślij wiadomość do supportu
            </button>}

        </div> : <h3 className="info info--adminContact">
            {status === 1 ? 'Wiadomość została wysłana' : (status === -1 ? 'Wpisz swoje pytanie' : "Coś poszło nie tak... Skontaktuj się z nami przez adres mailowy: kontakt@skylo.pl")}
        </h3>}
    </div>
};

export default ContactWithSupport;
