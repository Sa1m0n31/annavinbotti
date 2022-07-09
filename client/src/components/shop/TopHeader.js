import React, {useContext, useState} from 'react';
import logo from '../../static/img/logo.svg'
import userIcon from '../../static/img/user-icon.svg'
import cartIcon from '../../static/img/cart-icon.svg'
import menuIcon from '../../static/img/menu.svg'
import backIcon from '../../static/img/arrow-back.svg'
import arrowDownIcon from '../../static/img/arrow-down.svg'
import poland from '../../static/img/poland.png'
import uk from '../../static/img/united-kingdom.png'
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import facebookIcon from "../../static/img/facebook.svg";
import instagramIcon from "../../static/img/instagram.svg";

const TopHeader = () => {
    const { language, setLanguage } = useContext(ContentContext);

    const [mobileSubmenu, setMobileSubmenu] = useState(-1);

    const menu = [
        {
            titlePl: 'Filozofia marki',
            titleEn: 'Our brand',
            link: '',
            submenu: [
                {
                    titlePl: "O nas",
                    titleEn: "About us",
                    link: '/o-nas'
                },
                {
                    titlePl: "Dbałość o środowisko",
                    titleEn: "Care about planet",
                    link: '/dbalosc-o-srodowisko'
                }
            ]
        },
        {
            titlePl: 'Buty',
            titleEn: 'Boots',
            link: '',
            submenu: [
                {
                    titlePl: 'Jak powstają',
                    titleEn: 'Jak powstają',
                    link: '/jak-powstaja'
                },
                {
                    titlePl: 'Jak zamawiać',
                    titleEn: 'Jak zamawiać',
                    link: '/jak-zamawiac'
                },
                {
                    titlePl: 'Jak mierzyć stopę',
                    titleEn: 'Jak mierzyc stopę',
                    link: '/jak-mierzyc-stope'
                },
                {
                    titlePl: 'Jak pielęgnować',
                    titleEn: 'Jak pielęgnować',
                    link: '/jak-pielegnowac'
                }
            ]
        },
        {
            titlePl: 'Sklep',
            titleEn: 'Shop',
            link: '/sklep'
        },
        {
            titlePl: 'Blog',
            titleEn: 'Blog',
            link: '/blog'
        },
        {
            titlePl: 'Kontakt',
            titleEn: 'Contact',
            link: '/kontakt'
        }
    ];

    const closeMenu = () => {
        const menuChildren = Array.from(document.querySelectorAll('.mobileMenu>*'));
        const menu = document.querySelector('.mobileMenu');

        menuChildren.forEach((item) => {
           item.style.opacity = '0';
        });
        setTimeout(() => {
            menu.style.transform = 'scaleX(0)';
        }, 300);
    }

    const openMenu = () => {
        const menuChildren = Array.from(document.querySelectorAll('.mobileMenu>*'));
        const menu = document.querySelector('.mobileMenu');

        menu.style.transform = 'scaleX(1)';
        setTimeout(() => {
            menuChildren.forEach((item) => {
                item.style.opacity = '1';
            });
        }, 300);
    }

    /* Working only if first items in menu consist submenus */
    const toggleMobileSubmenu = (i) => {
        const mobileSubmenus= Array.from(document.querySelectorAll('.mobileMenu__menu__submenu'));
        const arrows = Array.from(document.querySelectorAll('.mobileMenu__menu__arrow'));

        if(mobileSubmenu === i) {
            setMobileSubmenu(-1);

            mobileSubmenus[i].style.height = '0';
            mobileSubmenus[i].style.paddingTop = '0';
            arrows[i].style.transform = 'none';
        }
        else {
            setMobileSubmenu(i);

            mobileSubmenus.forEach((item, index) => {
                if(index === i) {
                    item.style.height = 'auto';
                    item.style.paddingTop = '10px';
                    arrows[i].style.transform = 'rotateX(180deg)';
                }
                else {
                    item.style.height = '0';
                    item.style.paddingTop = '0';
                    arrows[index].style.transform = 'none';
                }
            });
        }
    }

    return <header className="topHeader">
        <div className="topHeader__firstRow w center">
            <a href="." className="topHeader__firstRow__link">
                <img className="img" src={logo} alt="anna-vinbotti" />
            </a>

            <div className="topHeader__firstRow__right flex d-desktop">
                <a href="/moje-konto" className="topHeader__firstRow__right__link">
                    <img className="img" src={userIcon} alt="moje-konto" />
                </a>
                <a href="/zamowienie" className="topHeader__firstRow__right__link">
                    <img className="img" src={cartIcon} alt="koszyk" />
                </a>
            </div>
        </div>

        {/* DESKTOP */}
        <menu className="topHeader__menu flex d-desktop">
            {menu?.map((item, index) => {
                return (item.link ? <a href={item.link} key={index} className="topHeader__menu__item">
                    {language === 'pl' ? item.titlePl : item.titleEn}
                </a> : <span className="topHeader__menu__item">
                    {language === 'pl' ? item.titlePl : item.titleEn}

                    <div className="topHeader__menu__submenu">
                        {item.submenu?.map((item, index) => {
                            return <a className="topHeader__menu__item"
                                      href={item.link}>
                                {language === 'pl' ? item.titlePl : item.titleEn}
                            </a>
                        })}
                    </div>
                </span>)
            })}
        </menu>

        {/* MOBILE */}
        <div className="topHeader__menu--mobile w flex d-mobile">
            <button className="topHeader__menu--mobile__btn" onClick={() => { openMenu(); }}>
                <img className="img" src={menuIcon} alt="menu" />
            </button>
            <a className="topHeader__menu--mobile__btn" href="/moje-konto">
                <img className="img" src={userIcon} alt="moje-konto" />
            </a>
            <a className="topHeader__menu--mobile__btn" href="/zamowienie">
                <img className="img" src={cartIcon} alt="koszyk" />
            </a>
        </div>

        {/* MOBILE MENU */}
        <div className="mobileMenu d-mobile">
            <div className="flex">
                <button className="mobileMenu__backBtn" onClick={() => { closeMenu(); }}>
                    <img className="img" src={backIcon} alt="zamknij" />
                </button>
                <button className="langBtn" onClick={() => { setLanguage(language === 'en' ? 'pl' : 'en') }}>
                    <img className="img" src={language === 'pl' ? uk : poland} alt="zmiana-jezyka" />
                </button>
            </div>

            <menu className="mobileMenu__menu">
                {menu?.map((item, index) => {
                    return (item.link ? <a href={item.link} key={index} className="mobileMenu__menu__item">
                        {language === 'pl' ? item.titlePl : item.titleEn}
                    </a> : <span className="mobileMenu__menu__item">
                        <button className="mobileMenu__menu__item mobileMenu__menu__item--btn flex" onClick={() => { toggleMobileSubmenu(index); }}>
                            {language === 'pl' ? item.titlePl : item.titleEn}
                            <img className="mobileMenu__menu__arrow" src={arrowDownIcon} alt="rozwin" />
                        </button>

                        <div className="mobileMenu__menu__submenu">
                            {item.submenu?.map((item, index) => {
                                return <a className="mobileMenu__menu__item"
                                          href={item.link}>
                                    {language === 'pl' ? item.titlePl : item.titleEn}
                                </a>
                            })}
                        </div>
                </span>)
                })}
            </menu>

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
    </header>
}

export default TopHeader;