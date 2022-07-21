import React, {useEffect, useState} from 'react';
import SideCart from "./SideCart";
import {getOrderById} from "../../helpers/orders";
import {groupBy} from "../../helpers/others";

const OrderReceived = ({orderId}) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if(orderId) {
            getOrderById(orderId)
                .then((res) => {
                    localStorage.removeItem('cart');
                    setCart(Object.entries(groupBy(res?.data?.result, 'type_id')));
                })
                .catch(() => {
                   window.location = '/';
                });
        }
    }, [orderId]);

    return <div className="order__main w flex order__main--form order__main--orderReceived">
        <div className="cart__left">
            <h2 className="order__loginForm__header">
                Dziękujemy za dokonanie rezerwacji
            </h2>
            <h3 className="orderReceived__header">
                Twoje zamówienie otrzymało numer
                <span>
                    #{orderId}
                </span>
            </h3>
            <p className="orderReceived__info">
                Czekamy 7 dni kalendarzowych na uzupełnienie formularza wymiaru stopy. Aby podać wymiary stopy, przejdź
                do panelu klienta lub kliknij przycisk poniżej.
            </p>

            {cart?.map((item, index) => {
                return <a key={index} className="btn btn--orderReceived"
                          href={`/formularz-mierzenia-stopy?zamowienie=${item[1][0].id}&typ=${item[0]}`}>
                    Podaj wymiary stopy
                </a>
            })}

            <div className="cart__summary--mobileWrapper d-to-900">
                <SideCart />
            </div>
        </div>
        <div className="cart__right d-from-900">
            <SideCart />
        </div>
    </div>
};

export default OrderReceived;
