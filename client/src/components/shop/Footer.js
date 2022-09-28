import React, {useEffect, useState} from 'react';
import logoWhite from '../../static/img/logo-footer.svg'
import constans from "../../helpers/constants";
import facebookIcon from "../../static/img/facebook.svg";
import instagramIcon from "../../static/img/instagram.svg";
import {isLoggedIn} from "../../helpers/auth";

const Footer = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        isLoggedIn()
            .then((res) => {
                if(res?.status === 200) {
                    setLoggedIn(true);
                }
            });
    }, []);

    return <footer className="footer">
        <div className="footer__inner flex w--extra">
            <div className="footer__col">
                <img className="footer__logo" src={logoWhite} alt="anna-vinbotti" />

                <span>
                    office@anna-vinbotti.pl
                </span>
                <span className="footer__phoneNumber">
                    tel. +48 570 272 901<br/>
                    <span>
                        (Obsługiwany od poniedziałku do piątku w godzinach 10:00 - 14:00)
                    </span>
                </span>

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
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Moje konto
                </h5>
                {!loggedIn ? <>
                    <a className="footer__link" href="/moje-konto">
                        Zaloguj się
                    </a>
                    <a className="footer__link" href="/moje-konto?sekcja=rejestracja">
                        Zarejestruj się
                    </a>
                </> : <a className="footer__link" href="/panel-klienta?sekcja=zamowienia">
                    Moje zamówienia
                </a>}
            </div>
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Informacje
                </h5>
                <a className="footer__link" href="/regulamin">
                    Regulamin
                </a>
                <a className="footer__link" href="/polityka-prywatnosci">
                    Polityka prywatności
                </a>
                <a className="footer__link" href="/oswiadczenie-reklamacyjne">
                    Oświadczenie reklamacyjne
                </a>
                <a className="footer__link" href="/gwarancja">
                    Gwarancja
                </a>
                <a className="footer__link" href="/faq">
                    Centrum pomocy / FAQ
                </a>
                <a className="footer__link" href="/adres-do-korespondencji">
                    Adres do korespondencji
                </a>
            </div>
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Zaobserwuj nas
                </h5>
                <div className="flex footer__socialMedia">
                    <a className="topBar__socialMedia__link" href={constans.FACEBOOK_LINK} target="_blank">
                        <img className="img" src={facebookIcon} alt="facebook" />
                    </a>
                    <a className="topBar__socialMedia__link" href={constans.INSTAGRAM_LINK} target="_blank">
                        <img className="img" src={instagramIcon} alt="instagram" />
                    </a>
                </div>
            </div>
        </div>
    </footer>
};

export default Footer;
