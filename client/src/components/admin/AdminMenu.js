import React, {useEffect, useRef, useState} from 'react'
import products from '../../static/img/products.svg'
import types from '../../static/img/types.svg'
import addons from '../../static/img/addons.svg'
import stack from '../../static/img/stack.svg'
import orders from '../../static/img/order.svg'
import blog from '../../static/img/writing.svg'
import newsletter from '../../static/img/newsletter.svg'
import terms from '../../static/img/terms-and-conditions.svg'
import home from '../../static/img/home.svg'

const AdminMenu = ({menuOpen}) => {
    const [submenu, setSubmenu] = useState(-1);
    const [mobileModal, setMobileModal] = useState(false);

    const panelMenu = useRef(null);

    const menu = [
        { name: 'Start', icon: home },
        { name: 'Modele', icon: products, link: '/lista-produktow' },
        { name: 'Dodatki', icon: addons, link: '/lista-dodatkow' },
        { name: 'Stany magazynowe', icon: stack, link: '/lista-stanow-magazynowych-produktow' },
        { name: 'Typy', icon: types, link: '/lista-kategorii' },
        { name: 'Zamówienia', icon: orders, link: '/lista-zamowien' },
        { name: 'Blog', icon: blog, link: '/lista-artykulow' },
        { name: 'Newsletter', icon: newsletter, link: '/newsletter' },
        { name: 'Regulaminy', icon: terms, link: '/regulaminy-polski' }
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
            {name: 'Lista stanów magazynowych modeli', link: '/lista-stanow-magazynowych-produktow'},
            {name: 'Edycja stanów magazynowych dodatków', link: '/lista-stanow-magazynowych-dodatkow'}
        ],
        [
            {name: 'Dodaj typ', link: '/dodaj-kategorie'},
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
            { name: "Lista mailingowa", link: '/newsletter' },
            { name: "Wyślij newsletter", link: '/wyslij-newsletter' }
        ],
        [
            { name: "Wersja polska", link: '/regulaminy-polski' },
            { name: "Wersja angielska", link: '/regulaminy-angielski' }
        ]
    ]

    const mainMenuItemClick = (index) => {
        if(menu[index].link) {
            window.location = menu[index].link;
        }

        if(submenu !== index) {
            setSubmenu(index);
        }
        else {
            setSubmenu(-1);
        }

        if(window.innerWidth < 996 && index) {
            setMobileModal(true);
        }
    }

    useEffect(() => {
        // Safari bug
        if(!mobileModal) {
            panelMenu.current.style.overflowY = 'auto';
        }
        else {
            panelMenu.current.style.overflowY = 'visible';
        }
    }, [mobileModal]);

    return <menu className="panelMenu scroll" ref={panelMenu}>
        <ul className="panelMenu__list">
            {menu.map((item, index) => {
                return <li className="panelMenu__list__item" key={index}>
                    <button className={submenu === index || menuOpen === index && (window.innerWidth > 996) ? "panelMenu__list__item__link panelMenu__list__item__link--selected" : "panelMenu__list__item__link"}
                            onClick={() => { mainMenuItemClick(index); }}>
                        <img className="panelMenu__list__item__icon" src={item.icon} alt={item.name} />
                        {index === 0 ? <a className="panelMenu__submenu__link--special" href="/panel">
                            <span className="d-900">
                                {item.name}
                            </span>
                        </a> : <span className="d-900">
                            {item.name}
                        </span>}
                    </button>
                    {submenu === index || menuOpen === index && (index !== 0) ? (window.innerWidth > 996 ? <ul className="panelMenu__submenu">
                        {submenus[index].map((item, index) => {
                            return <li className="panelMenu__submenu__item" key={index}>
                                <a className="panelMenu__submenu__link" href={item.link}>
                                    {item.name}
                                </a>
                            </li>
                        })}
                    </ul>  : (mobileModal ? <div className="modalMenu">
                        <div className="modal__inner">
                            <button className="colorModal__close" onClick={() => { setMobileModal(false); }}>
                                &times;
                            </button>

                            <h3 className="modal__header">
                                {menu[submenu]?.name}
                            </h3>
                            <ul>
                                {submenus[submenu].map((item, index) => {
                                    return <li className="panelMenu__submenu__item" key={index}>
                                        <a className="panelMenu__submenu__link" href={item.link}>
                                            {item.name}
                                        </a>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div> : '')) : ""}
                </li>
            })}
        </ul>
    </menu>
}

export default AdminMenu;
