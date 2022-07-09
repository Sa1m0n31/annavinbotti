import React, {useEffect, useState} from 'react';
import SideCart from "./SideCart";
import {getNumberOfFirstTypeFormsByOrder} from "../../helpers/orders";

const OrderReceived = ({orderId}) => {
    const [buttons, setButtons] = useState([1]);

    useEffect(() => {
        if(orderId) {
            getNumberOfFirstTypeFormsByOrder(orderId)
                .then((res) => {
                    if(res?.status === 200) {
                        console.log(res.data);
                        setButtons([1, 2])
                    }
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
                    {orderId}
                </span>
            </h3>
            <p className="orderReceived__info">
                Czekamy 7 dni kalendarzowych na uzupełnienie formularza wymiaru stopy. Aby podać wymiary stopy, przejdź
                do panelu klienta lub kliknij przycisk poniżej.
            </p>

            {buttons?.map((item, index) => {
                return <button key={index} className="btn btn--orderReceived">
                    Podaj wymiary stopy
                </button>
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
