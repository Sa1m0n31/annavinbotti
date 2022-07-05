import React, {useContext} from 'react';
import logo from '../../static/img/logo.svg'
import userIcon from '../../static/img/user-icon.svg'
import cartIcon from '../../static/img/cart-icon.svg'
import {ContentContext} from "../../App";

const TopHeader = () => {
    const { language } = useContext(ContentContext);

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
    ]

    return <header className="topHeader">
        <div className="topHeader__firstRow w center">
            <a href="." className="topHeader__firstRow__link">
                <img className="img" src={logo} alt="anna-vinbotti" />
            </a>

            <div className="topHeader__firstRow__right flex">
                <a href="/moje-konto" className="topHeader__firstRow__right__link">
                    <img className="img" src={userIcon} alt="moje-konto" />
                </a>
                <a href="/koszyk" className="topHeader__firstRow__right__link">
                    <img className="img" src={cartIcon} alt="koszyk" />
                </a>
            </div>
        </div>

        <menu className="topHeader__menu flex">
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
    </header>
}

export default TopHeader;
