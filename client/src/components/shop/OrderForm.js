import React, {useContext, useEffect, useRef, useState} from 'react';
import SideCart from "./SideCart";
import Login from "./Login";
import {isLoggedIn} from "../../helpers/auth";
import Loader from "./Loader";
import {getUserInfo} from "../../helpers/user";
import OrderFormFields from "./OrderFormFields";
import {isEmail} from "../../helpers/others";
import {addOrder} from "../../helpers/orders";
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";
import {decrementStockByAddon, decrementStockByProduct} from "../../helpers/stocks";

const OrderForm = ({backToCart, nextStep, setOrderId}) => {
    const { cartContent } = useContext(CartContext);
    const { language } = useContext(ContentContext);

    const [user, setUser] = useState(null);
    const [userWithData, setUserWithData] = useState(false);
    const [render, setRender] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formVisibleDisplay, setFormVisibleDisplay] = useState(false);
    const [formAnchor, setFormAnchor] = useState('');
    const [error, setError] = useState("");
    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);
    const [c3, setC3] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const orderLeft = useRef(null);

    const [formFields, setFormFields] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        building: '',
        flat: '',
        street: '',
        city: '',
        postalCode: '',
        invoice: false,
        companyName: '',
        nip: '',
        differentDeliveryAddress: false,
        deliveryFirstName: '',
        deliveryLastName: '',
        deliveryPhoneNumber: '',
        deliveryBuilding: '',
        deliveryFlat: '',
        deliveryStreet: '',
        deliveryCity: '',
        deliveryPostalCode: ''
    });

    const handleFieldChange = (event, fieldId) => {
        let newFields = { ...formFields };
        newFields[fieldId] = typeof event !== "boolean" ? event.target.value : event;
        setFormFields(newFields);
    }

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
            });
    }, [userLoggedIn]);

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
            setFormFields({
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                building: user.building,
                flat: user.flat,
                street: user.street,
                city: user.city,
                postalCode: user.postal_code,
                invoice: false,
                companyName: '',
                nip: '',
                differentDeliveryAddress: false,
                deliveryFirstName: '',
                deliveryLastName: '',
                deliveryPhoneNumber: '',
                deliveryBuilding: '',
                deliveryFlat: '',
                deliveryStreet: '',
                deliveryCity: '',
                deliveryPostalCode: ''
            });
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

    const validateOrder = () => {
        if(!c1 || !c2) {
            return 'Uzupełnij wymagane zgody';
        }
        else if(!formFields.firstName || !formFields.lastName || !isEmail(formFields.email) || !formFields.phoneNumber
            || !formFields.street || !formFields.building || !formFields.city || !formFields.postalCode
        ) {
            return 'Uzupełnij wymagane pola';
        }
        else if(formFields.invoice && (!formFields.companyName || !formFields.nip)) {
            return 'Uzupełnij dane do faktury';
        }
        else if(formFields.differentDeliveryAddress && (
            !formFields.deliveryFirstName || !formFields.deliveryLastName || !formFields.deliveryPhoneNumber
            || !formFields.deliveryBuilding || !formFields.deliveryStreet || !formFields.deliveryCity || !formFields.deliveryPostalCode
        )) {
            return 'Uzupełnij dane dostawy';
        }
        else {
            return 'true';
        }
    }

    const decrementStocks = (sells, addons) => {
        sells.forEach((item) => {
            decrementStockByProduct(item.product, item.amount);
        })
        addons.forEach((item) => {
            item.options.forEach((addonOption) => {
                decrementStockByAddon(addonOption, 1);
            });
        });
    }

    const registerOrder = () => {
        if(validateOrder() === 'true') {
            const sells = cartContent.map((item) => {
                return {
                    product: item.product.id,
                    price: item.product.price,
                    amount: item.amount
                }
            });
            const addons = cartContent.map((item, index) => {
                return {
                    sell: index,
                    options: Object.values(item.addons)
                }
            });

            decrementStocks(sells, addons);

            if(formVisible) {
                // User edited data
                addOrder(formFields,
                    {
                        street: formFields.street,
                        building: formFields.building,
                        flat: formFields.flat,
                        city: formFields.city,
                        postal_code: formFields.postal_code
                    },
                    {
                        street: formFields.deliveryStreet,
                        building: formFields.deliveryBuilding,
                        flat: formFields.deliveryFlat,
                        city: formFields.deliveryCity,
                        postal_code: formFields.deliveryPostalCode
                    },
                    formFields.companyName ? formFields.companyName : null, formFields.nip ? formFields.nip : null,
                    sells, addons
                    )
                    .then((res) => {
                        if(res?.status === 201) {
                            setOrderId(res?.data?.id);
                            nextStep();
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
                    })
                    .catch(() => {
                        setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                    });
            }
            else {
                // Data from user profile
                addOrder(formFields,
                    user.address, user.address,
                    null, null,
                    sells, addons)
                    .then((res) => {
                        if(res?.status === 201) {
                            setOrderId(res?.data?.id);
                            nextStep();
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
                    })
                    .catch(() => {
                        setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                    });
            }
        }
        else {
            setError(validateOrder());
        }
    }

    return <div className="order__main w flex order__main--form">
        {render ? <>
            <div className="cart__left" ref={orderLeft}>
                {!user && !formVisibleDisplay ? <div className="order__loginForm">
                    <h2 className="order__loginForm__header">
                        Zaloguj się
                    </h2>
                    <Login fromCart={true} setUserLoggedIn={setUserLoggedIn} />
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
                                        onClick={() => { setFormVisible(true); setFormAnchor('invoice'); }}>

                                </button>
                                <span>
                                    Chcę otrzymać fakturę VAT
                                </span>
                            </label>
                            <label className="form__addons__label">
                                <button className="form__check"
                                        type="button"
                                        onClick={() => { setFormVisible(true); setFormAnchor('personalData'); }}>

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
                                        onClick={() => { setFormVisible(true); setFormAnchor('deliveryAddress'); }}>

                                </button>
                                <span>
                                    Zmień adres dostawy
                                </span>
                            </label>
                        </div>
                    </div>
                </div> : <OrderFormFields user={user}
                                          fields={formFields}
                                          handleChange={handleFieldChange}
                                          formAnchor={formAnchor} />)}

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
                        {error ? <p className="info--error info--error--order">
                            {error}
                        </p> : ''}
                        <button className="btn btn--order" onClick={() => { registerOrder(); }}>
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
