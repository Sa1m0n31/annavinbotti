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
            link: '/filozofia-marki'
        },
        {
            titlePl: 'Buty',
            titleEn: 'Boots',
            link: '/buty'
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
                return <a href={item.link} key={index} className="topHeader__menu__item">
                    {language === 'pl' ? item.titlePl : item.titleEn}
                </a>
            })}
        </menu>
    </header>
}

export default TopHeader;
