import React, {useEffect, useState} from 'react';

const OrderFormFields = ({user}) => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [flat, setFlat] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [invoice, setInvoice] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [nip, setNip] = useState("");

    const [differentDeliveryAddress, setDifferentDeliveryAddress] = useState(false);
    const [deliveryFirstName, setDeliveryFirstName] = useState("");
    const [deliveryLastName, setDeliveryLastName] = useState("");
    const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState("");
    const [deliveryStreet, setDeliveryStreet] = useState("");
    const [deliveryBuilding, setDeliveryBuilding] = useState("");
    const [deliveryFlat, setDeliveryFlat] = useState("");
    const [deliveryCity, setDeliveryCity] = useState("");
    const [deliveryPostalCode, setDeliveryPostalCode] = useState("");

    useEffect(() => {
        if(user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
            setPhoneNumber(user.phone_number);
            setStreet(user.street);
            setBuilding(user.building);
            setFlat(user.flat);
            setCity(user.city);
            setPostalCode(user.postal_code);
        }
    }, [user]);

    return <div className="orderFormFields">
        <h2 className="order__loginForm__header">
            Dane do rozliczenia
        </h2>
        <form className="orderForm">
            {/* PERSONAL DATA */}
            <label>
                E-mail*
                <input className="input input--order"
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
            </label>
            <div className="flex">
                <label>
                    Imię
                    <input className="input input--order"
                           value={firstName}
                           onChange={(e) => { setFirstName(e.target.value); }} />
                </label>
                <label>
                    Nazwisko
                    <input className="input input--order"
                           value={lastName}
                           onChange={(e) => { setLastName(e.target.value); }} />
                </label>
            </div>
            <label>
                Nr telefonu*
                <input className="input input--order"
                       value={phoneNumber}
                       onChange={(e) => { setPhoneNumber(e.target.value); }} />
            </label>
            <label>
                Ulica*
                <input className="input input--order"
                       value={street}
                       onChange={(e) => { setStreet(e.target.value); }} />
            </label>
            <div className="flex">
                <label>
                    Nr domu*
                    <input className="input input--order"
                           value={building}
                           onChange={(e) => { setBuilding(e.target.value); }} />
                </label>
                <label>
                    Nr lokalu
                    <input className="input input--order"
                           value={flat}
                           onChange={(e) => { setFlat(e.target.value); }} />
                </label>
            </div>
            <div className="flex">
                <label>
                    Kod pocztowy*
                    <input className="input input--order"
                           value={postalCode}
                           onChange={(e) => { setPostalCode(e.target.value); }} />
                </label>
                <label>
                    Miejscowość
                    <input className="input input--order"
                           value={city}
                           onChange={(e) => { setCity(e.target.value); }} />
                </label>
            </div>

            {/* INVOICE */}
            <label className="form__addons__label">
                <button className={invoice ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setInvoice(!invoice); }}>

                </button>
                <span>
                        Chcę otrzymać fakturę VAT
                </span>
            </label>
            {invoice ? <div className="flex">
                <label>
                    Nazwa firmy*
                    <input className="input input--order"
                           value={companyName}
                           onChange={(e) => { setCompanyName(e.target.value); }} />
                </label>
                <label>
                    NIP*
                    <input className="input input--order"
                           value={nip}
                           onChange={(e) => { setNip(e.target.value); }} />
                </label>
            </div> : ''}

            {/* DIFFERENT DELIVERY ADDRESS */}
            <label className="form__addons__label">
                <button className={differentDeliveryAddress ? "form__check form__check--selected" : "form__check"}
                        type="button"
                        onClick={() => { setDifferentDeliveryAddress(!differentDeliveryAddress); }}>

                </button>
                <span>
                    Inny adres dostawy
                </span>
            </label>
            {differentDeliveryAddress ? <>
                <div className="flex">
                    <label>
                        Imię
                        <input className="input input--order"
                               value={deliveryFirstName}
                               onChange={(e) => { setDeliveryFirstName(e.target.value); }} />
                    </label>
                    <label>
                        Nazwisko
                        <input className="input input--order"
                               value={deliveryLastName}
                               onChange={(e) => { setDeliveryLastName(e.target.value); }} />
                    </label>
                </div>
                <label>
                    Nr telefonu*
                    <input className="input input--order"
                           value={deliveryPhoneNumber}
                           onChange={(e) => { setDeliveryPhoneNumber(e.target.value); }} />
                </label>
                <label>
                    Ulica*
                    <input className="input input--order"
                           value={deliveryStreet}
                           onChange={(e) => { setDeliveryStreet(e.target.value); }} />
                </label>
                <div className="flex">
                    <label>
                        Nr domu*
                        <input className="input input--order"
                               value={deliveryBuilding}
                               onChange={(e) => { setDeliveryBuilding(e.target.value); }} />
                    </label>
                    <label>
                        Nr lokalu
                        <input className="input input--order"
                               value={deliveryFlat}
                               onChange={(e) => { setDeliveryFlat(e.target.value); }} />
                    </label>
                </div>
                <div className="flex">
                    <label>
                        Kod pocztowy*
                        <input className="input input--order"
                               value={deliveryPostalCode}
                               onChange={(e) => { setDeliveryPostalCode(e.target.value); }} />
                    </label>
                    <label>
                        Miejscowość
                        <input className="input input--order"
                               value={deliveryCity}
                               onChange={(e) => { setDeliveryCity(e.target.value); }} />
                    </label>
                </div>
            </> : ''}
        </form>
    </div>
};

export default OrderFormFields;
