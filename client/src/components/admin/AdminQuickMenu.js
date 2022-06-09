import React from 'react';
import models from '../../static/img/products.svg'
import addons from '../../static/img/addons.svg'
import orders from '../../static/img/order.svg'
import types from '../../static/img/types.svg'
import newsletter from '../../static/img/newsletter.svg'
import blog from '../../static/img/writing.svg'

const AdminQuickMenu = () => {
    return <div className="admin__start__section">
        <h3 className="admin__start__section__header">
            Szybki dostęp
        </h3>
        <div className="admin__start__statsWrapper">
            <a className="admin__start__stats" href="/lista-produktow">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={models} alt="modele" />
                </span>
                <span className="admin__start__stats__key">
                    Modele
                </span>
            </a>
            <a className="admin__start__stats" href="/lista-dodatkow">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={addons} alt="dodatki" />
                </span>
                <span className="admin__start__stats__key">
                    Dodatki
                </span>
            </a>
            <a className="admin__start__stats" href="/lista-zamowien">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={orders} alt="zamowienia" />
                </span>
                <span className="admin__start__stats__key">
                    Zamówienia
                </span>
            </a>

            <a className="admin__start__stats" href="/lista-kategorii">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={types} alt="zamowienia" />
                </span>
                <span className="admin__start__stats__key">
                    Typy
                </span>
            </a>
            <a className="admin__start__stats" href="/newsletter">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={newsletter} alt="zamowienia" />
                </span>
                <span className="admin__start__stats__key">
                    Newsletter
                </span>
            </a>
            <a className="admin__start__stats" href="/lista-artykulow">
                <span className="admin__start__stats__value">
                    <img className="quickImg" src={blog} alt="zamowienia" />
                </span>
                <span className="admin__start__stats__key">
                    Blog
                </span>
            </a>
        </div>
    </div>
};

export default AdminQuickMenu;
