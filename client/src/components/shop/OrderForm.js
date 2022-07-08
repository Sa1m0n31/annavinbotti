import React, {useEffect, useRef, useState} from 'react';
import SideCart from "./SideCart";
import Login from "./Login";
import {isLoggedIn} from "../../helpers/auth";
import Loader from "./Loader";
import {getUserInfo} from "../../helpers/user";
import OrderFormFields from "./OrderFormFields";

const OrderForm = ({backToCart}) => {
    const [user, setUser] = useState(null);
    const [userWithData, setUserWithData] = useState(false);
    const [render, setRender] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formVisibleDisplay, setFormVisibleDisplay] = useState(false);

    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);
    const [c3, setC3] = useState(false);

    const orderLeft = useRef(null);

    useEffect(() => {
        getUserInfo()
            .then((res) => {
                if(res?.status === 200) {
                    setUser(res?.data?.result[0]);
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
                setRender(true);
            })
    }, []);

    const validateUserData = () => {
        if(user.first_name && user.last_name && user.email && user.phone_number
            && user.city && user.street && user.building && user.postal_code
        ) {
            setUserWithData(true);
        }
        setRender(true);
    }

    useEffect(() => {
        if(user) {
            validateUserData();
        }
    }, [user]);

    useEffect(() => {
        if(orderLeft?.current) {
            orderLeft.current.style.opacity = '0';
            setTimeout(() => {
                setFormVisibleDisplay(formVisible);
                setTimeout(() => {
                    orderLeft.current.style.opacity = '1';
                }, 100)
            }, 500);
        }
    }, [formVisible]);

    return <div className="order__main w flex order__main--form">
        {render ? <>
            <div className="cart__left" ref={orderLeft}>
                {!user && !formVisibleDisplay ? <div className="order__loginForm">
                    <h2 className="order__loginForm__header">
                        Zaloguj się
                    </h2>
                    <Login fromCart={true} />
                </div> : (userWithData && !formVisibleDisplay ? <div className="order__userData">
                    <h2 className="order__loginForm__header">
                        Zalogowany użytkownik
                    </h2>
                    <div className="order__userData__data flex">
                        <div className="order__userData__data__block">
                            <h3 className="order__loginForm__header">
                                Dane rozliczeniowe:
                            </h3>
                            <div className="order__userData__text">
                                <p className="bold">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p>
                                    {user.email}
                                </p>
                                <p>
                                    {user.phone_number}
                                </p>
                                <p>
                                    {user.street} {user.building}{user.flat ? `/${user.flat}` : ''}
                                </p>
                                <p>
                                    {user.postal_code} {user.city}
                                </p>
                            </div>

                            <label className="form__addons__label">
                                <button className="form__check"
                                        type="button"
                                        onClick={() => { setFormVisible(true); }}>

                                </button>
                                <span>
                                    Chcę otrzymać fakturę VAT
                                </span>
                            </label>
                            <label className="form__addons__label">
                                <button className="form__check"
                                        type="button"
                                        onClick={() => { setFormVisible(true); }}>

                                </button>
                                <span>
                                    Zmień dane rozliczeniowe
                                </span>
                            </label>

                        </div>
                        <div className="order__userData__data__block">
                            <h3 className="order__loginForm__header">
                                Adres dostawy:
                            </h3>
                            <div className="order__userData__text">
                                <p className="bold">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p>
                                    {user.street} {user.building}{user.flat ? `/${user.flat}` : ''}
                                </p>
                                <p>
                                    {user.postal_code} {user.city}
                                </p>
                            </div>

                            <label className="form__addons__label">
                                <button className="form__check"
                                        type="button"
                                        onClick={() => { setFormVisible(true); }}>

                                </button>
                                <span>
                                    Zmień adres dostawy
                                </span>
                            </label>
                        </div>
                    </div>
                </div> : <OrderFormFields user={user} />)}

                {user ? <>
                    <div className="order__checkboxes">
                        <label className="form__addons__label">
                            <button className={c1 ? "form__check form__check--selected" : "form__check"}
                                    type="button"
                                    onClick={() => { setC1(!c1); }}>

                            </button>
                            <span>
                            Wyrażam zgodę na przetwarzanie moich danych osobowych. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor*
                        </span>
                        </label>
                        <label className="form__addons__label">
                            <button className={c2 ? "form__check form__check--selected" : "form__check"}
                                    type="button"
                                    onClick={() => { setC2(!c2); }}>

                            </button>
                            <span>
                            Oświadczam, iż zapoznałem się z regulaminem i akceptuję politykę prywatności.
                        </span>
                        </label>
                        <label className="form__addons__label">
                            <button className={c3 ? "form__check form__check--selected" : "form__check"}
                                    type="button"
                                    onClick={() => { setC3(!c3); }}>

                            </button>
                            <span>
                            Zapisuję się do newslettera
                        </span>
                        </label>
                    </div>

                    <div className="cart__summary--mobileWrapper d-to-900">
                        <SideCart />
                    </div>

                    <div className="order__buttons">
                        <button className="btn btn--order">
                            Rezerwuję
                        </button>
                        <button className="btn--backToCart" onClick={() => { backToCart(); }}>
                            &lt;&lt; Wróć
                        </button>
                    </div>
                </> : ''}
            </div>
            <div className="cart__right d-from-900">
                <SideCart />
            </div>
        </> : <div className="order__main__loader center">
            <Loader />
        </div>}
    </div>
};

export default OrderForm;
