import React from 'react';
import logoWhite from '../../static/img/logo-footer.svg'
import constans from "../../helpers/constants";
import facebookIcon from "../../static/img/facebook.svg";
import instagramIcon from "../../static/img/instagram.svg";

const Footer = () => {
    return <footer className="footer">
        <div className="footer__inner flex w--extra">
            <div className="footer__col">
                <img className="footer__logo" src={logoWhite} alt="anna-vinbotti" />

                <span>
                    office@anna-vinbotti.pl<br/>
                    123 123 123
                </span>
            </div>
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Moje zamówienie
                </h5>
                <a className="footer__link" href="/status-zamowienie">
                    Status zamówienia
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Reklamacja i gwarancja
                </a>
            </div>
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Moje konto
                </h5>
                <a className="footer__link" href="/status-zamowienie">
                    Zaloguj się
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Załóż konto
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Moje zamówienia
                </a>
            </div>
            <div className="footer__col">
                <h5 className="footer__col__header">
                    Informacje
                </h5>
                <a className="footer__link" href="/status-zamowienie">
                    Regulamin
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Polityka prywatności
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Odstąpienie od umowy
                </a>
                <a className="footer__link" href="/status-zamowienie">
                    Regulamin
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Polityka prywatności
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Odstąpienie od umowy
                </a>
                <a className="footer__link" href="/reklamacja-i-gwarancja">
                    Odstąpienie od umowy
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
