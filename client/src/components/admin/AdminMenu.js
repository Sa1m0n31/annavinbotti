import React, {useState} from 'react'
import products from '../../static/img/products.svg'
import types from '../../static/img/types.svg'
import addons from '../../static/img/addons.svg'
import stack from '../../static/img/stack.svg'
import orders from '../../static/img/order.svg'
import forms from '../../static/img/contact-form.svg'
import blog from '../../static/img/writing.svg'
import newsletter from '../../static/img/newsletter.svg'
import terms from '../../static/img/terms-and-conditions.svg'
import content from '../../static/img/writer.svg'
import settings from '../../static/img/settings.svg'
import home from '../../static/img/home.svg'

const AdminMenu = ({menuOpen}) => {
    const [submenu, setSubmenu] = useState(-1);

    const menu = [
        { name: 'Start', icon: home },
        { name: 'Modele', icon: products },
        { name: 'Dodatki', icon: addons },
        { name: 'Stany magazynowe', icon: stack },
        { name: 'Typy', icon: types },
        { name: 'Zamówienia', icon: orders },
        { name: 'Blog', icon: blog },
        { name: 'Newsletter', icon: newsletter },
        { name: 'Regulaminy', icon: terms },
        { name: 'Treści', icon: content },
        { name: 'Ustawienia', icon: settings }
    ]

    const submenus = [
        [],
        [
            {name: 'Dodaj model', link: '/dodaj-produkt'},
            {name: 'Lista modeli', link: '/lista-produktow'}
        ],
        [
            {name: 'Dodaj dodatek', link: '/dodaj-dodatek'},
            {name: 'Lista dodatków', link: '/lista-dodatkow'}
        ],
        [
            {name: 'Dodaj stan modeli', link: '/dodaj-stan-magazynowy-produktow'},
            {name: 'Dodaj stan dodatków', link: '/dodaj-stan-magazynowy-dodatkow'},
            {name: 'Modele', link: '/lista-stanow-magazynowych-produktow'},
            {name: 'Dodatki', link: '/lista-stanow-magazynowych-dodatkow'}
        ],
        [
            {name: 'Dodaj typy', link: '/dodaj-kategorie'},
            {name: 'Lista typów', link: '/lista-kategorii'}
        ],
        [
            {name: 'Lista zamówień', link: '/lista-zamowien'},
            {name: 'Waitlista', link: '/waitlista'}
        ],
        // [
        //     { name: 'Dodaj pole', link: '/dodaj-pole' },
        //     { name: 'Dodaj formularz', link: '/dodaj-formularz' },
        //     { name: 'Lista pól', link: '/lista-pol' },
        //     { name: 'Lista formularzy', link: '/lista-formularzy' }
        // ],
        [
            { name: "Dodaj artykuł", link: '/dodaj-artykul' },
            { name: "Lista artykułów", link: '/lista-artykulow' }
        ],
        [
            { name: "Lista mailingowa", link: '/newsletter' }
        ],
        [
            { name: "Wersja polska", link: '/regulaminy-polski' },
            { name: "Wersja angielska", link: '/regulaminy-angielski' }
        ],
        [
            { name: "Wersja polska", link: '/tresci-polski' },
            { name: "Wersja angielska", link: '/tresci-angielski' }
        ],
        [
            { name: "Ustawienia", link: '/ustawienia' }
        ]
    ]

    return <menu className="panelMenu scroll">
        <ul className="panelMenu__list">
            {menu.map((item, index) => {
                return <li className="panelMenu__list__item" key={index}>
                    <button className={submenu === index || menuOpen === index ? "panelMenu__list__item__link panelMenu__list__item__link--selected" : "panelMenu__list__item__link"}
                            onClick={() => { if(submenu !== index) setSubmenu(index); else setSubmenu(-1); }}>
                        <img className="panelMenu__list__item__icon" src={item.icon} alt={item.name} />
                        {index === 0 ? <a className="panelMenu__submenu__link--special" href="/panel">
                            {item.name}
                        </a> : item.name}
                    </button>
                    {submenu === index || menuOpen === index ? <ul className="panelMenu__submenu">
                        {submenus[index].map((item, index) => {
                            return <li className="panelMenu__submenu__item" key={index}>
                                <a className="panelMenu__submenu__link" href={item.link}>
                                    {item.name}
                                </a>
                            </li>
                        })}
                    </ul> : ""}
                </li>
            })}
        </ul>
    </menu>
}

export default AdminMenu;
