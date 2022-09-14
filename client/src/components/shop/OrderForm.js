import React, {useContext, useEffect, useRef, useState} from 'react';
import SideCart from "./SideCart";
import Login from "./Login";
import Loader from "./Loader";
import {getUserInfo} from "../../helpers/user";
import OrderFormFields from "./OrderFormFields";
import {
    isAlphanumeric,
    isEmail,
    isInteger,
    validatePhoneNumberChange,
    validatePostalCodeChange
} from "../../helpers/others";
import {addOrder} from "../../helpers/orders";
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";
import {decrementStockByAddon, decrementStockByProduct} from "../../helpers/stocks";

const OrderForm = ({backToCart, nextStep, setOrderId, shipping}) => {
    const { cartContent } = useContext(CartContext);
    const { language } = useContext(ContentContext);

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [userWithData, setUserWithData] = useState(false);
    const [render, setRender] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [formVisibleDisplay, setFormVisibleDisplay] = useState(false);
    const [formAnchor, setFormAnchor] = useState('');
    const [error, setError] = useState("");
    const [c1, setC1] = useState(false);
    const [c2, setC2] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [outOfStock, setOutOfStock] = useState(false);

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

        if(fieldId === 'phoneNumber' || fieldId === 'deliveryPhoneNumber') {
            if(validatePhoneNumberChange(event.target.value)) {
                newFields[fieldId] = event.target.value;
            }
        }
        else if(fieldId === 'postalCode') {
            newFields[fieldId] = validatePostalCodeChange(formFields.postalCode, event.target.value);
        }
        else if(fieldId === 'deliveryPostalCode') {
            newFields[fieldId] = validatePostalCodeChange(formFields.deliveryPostalCode, event.target.value);
        }
        else if(fieldId === 'flat' || fieldId === 'building' || fieldId === 'deliveryFlat' || fieldId === 'deliveryBuilding') {
            if(event.target.value.length) {
                if(isAlphanumeric(event.target.value)) {
                    newFields[fieldId] = event.target.value;
                }
                else {
                    newFields[fieldId] = event.target.value.slice(0, -1);
                }
            }
            else {
                newFields[fieldId] = '';
            }
        }
        else if(fieldId === 'nip') {
            const n = event.target.value;

            if(isInteger(n) && n.charAt(n.length-1) !== '.' && n.length <= 10) {
                newFields[fieldId] = n;
            }
            else {
                newFields[fieldId] = n.slice(0, -1);
            }
        }
        else {
            newFields[fieldId] = typeof event !== "boolean" ? event.target.value : event;
        }

        setFormFields(newFields);
    }

    useEffect(() => {
        if(userLoggedIn) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

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
        if(!c1) {
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
        addons.forEach((item, index) => {
            const sellAmount = sells[index].amount;
            item.options.forEach((addonOption) => {
                decrementStockByAddon(addonOption, sellAmount);
            });
        });
    }

    const registerOrder = () => {
        if(validateOrder() === 'true') {
            setLoading(true);

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

            if(formVisible || !userWithData) {
                // User edited data
                addOrder(formFields,
                    {
                        street: formFields.street,
                        building: formFields.building,
                        flat: formFields.flat,
                        city: formFields.city,
                        postal_code: formFields.postalCode,
                        firstName: formFields.firstName,
                        lastName: formFields.lastName,
                        phoneNumber: formFields.phoneNumber
                    },
                    {
                        street: formFields.differentDeliveryAddress ? formFields.deliveryStreet : formFields.street,
                        building: formFields.differentDeliveryAddress ? formFields.deliveryBuilding : formFields.building,
                        flat: formFields.differentDeliveryAddress ? formFields.deliveryFlat : formFields.flat,
                        city: formFields.differentDeliveryAddress ? formFields.deliveryCity : formFields.city ,
                        postal_code: formFields.differentDeliveryAddress ? formFields.deliveryPostalCode : formFields.postalCode,
                        firstName: formFields.differentDeliveryAddress ? formFields.deliveryFirstName : formFields.firstName,
                        lastName: formFields.differentDeliveryAddress ? formFields.deliveryLastName : formFields.lastName,
                        phoneNumber: formFields.differentDeliveryAddress ? formFields.deliveryPhoneNumber : formFields.phoneNumber
                    },
                     formFields.nip ? formFields.nip : null, formFields.companyName ? formFields.companyName : null,
                    sells, addons, shipping?.pl, c2 ? 'true': null
                    )
                    .then((res) => {
                        decrementStocks(sells, addons);

                        setLoading(false);
                        if(res?.status === 201) {
                            setOrderId(res?.data?.id);
                            nextStep();
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        if(err.response.status === 403) {
                            setOutOfStock(true);
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
                    });
            }
            else {
                // Data from user profile
                addOrder(formFields,
                    user.address, user.address,
                    null, null,
                    sells, addons, shipping?.pl, c2 ? 'true': null)
                    .then((res) => {
                        decrementStocks(sells, addons);
                        setLoading(false);
                        if(res?.status === 201) {
                            setOrderId(res?.data?.id);
                            nextStep();
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        if(err.response.status === 403) {
                            setOutOfStock(true);
                        }
                        else {
                            setError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                        }
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
                                        onClick={() => { setFormVisible(true); setFormAnchor(window.innerWidth > 768 ? 'invoice' : 'invoice--mobile'); }}>

                                </button>
                                <span>
                                    Chcę otrzymać fakturę VAT
                                </span>
                            </label>
                            <label className="form__addons__label">
                                <button className="form__check"
                                        type="button"
                                        onClick={() => { setFormVisible(true); setFormAnchor(window.innerWidth > 768 ? 'personalData' : 'personalData--mobile'); }}>

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
                                        onClick={() => { setFormVisible(true); setFormAnchor(window.innerWidth > 768 ? 'deliveryAddress' : 'deliveryAddress--mobile'); }}>

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
                                <span></span>
                            </button>
                            <span className="checkboxText">
                                Oświadczam, że zapoznałem/-am się z <a href="/polityka-prywatnosci" target="_blank">Polityką prywatności</a> *
                            </span>
                        </label>

                        <label className="form__addons__label">
                            <button className={c2 ? "form__check form__check--selected" : "form__check"}
                                    type="button"
                                    onClick={() => { setC2(!c2); }}>
                                <span></span>
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

                        {outOfStock ? <p className="info--error info--error--order">
                            {cartContent?.length === 1 ? 'Model, który chesz zamówić nie jest na ten moment dostępny' : 'Modele, które chcesz zamówić nie są na ten moment dostępne'}
                        </p> : ''}

                        {loading ? <div className="center">
                            <Loader />
                        </div> : <button className="btn btn--order" onClick={() => { registerOrder(); }}>
                            Rezerwuję
                        </button>}
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
