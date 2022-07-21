import React, {useEffect} from 'react';

const OrderFormFields = ({formAnchor, fields, handleChange}) => {
    useEffect(() => {
        if(formAnchor) {
            document.getElementById(formAnchor).scrollIntoView({
                behavior: 'smooth'
            });

            if(formAnchor === 'invoice' || formAnchor === 'invoice--mobile') {
                handleChange(true, 'invoice');
            }
            else if(formAnchor === 'deliveryAddress' || formAnchor === 'deliveryAddress--mobile') {
                handleChange(true, 'differentDeliveryAddress');
            }
        }
    }, [formAnchor]);

    return <div className="orderFormFields">
        <h2 className="order__loginForm__header">
            Dane do rozliczenia
        </h2>
        <form className="orderForm">
            {/* PERSONAL DATA */}
            <div id="personalData">
                <span className="anchorSpan" id="personalData--mobile"></span>
                <label>
                    E-mail*
                    <input className="input input--order"
                           value={fields.email}
                           onChange={(e) => { handleChange(e, 'email'); }} />
                </label>
                <div className="flex">
                    <label>
                        Imię
                        <input className="input input--order"
                               value={fields.firstName}
                               onChange={(e) => { handleChange(e, 'firstName'); }} />
                    </label>
                    <label>
                        Nazwisko
                        <input className="input input--order"
                               value={fields.lastName}
                               onChange={(e) => { handleChange(e, 'lastName'); }} />
                    </label>
                </div>
                <label>
                    Nr telefonu*
                    <input className="input input--order"
                           value={fields.phoneNumber}
                           onChange={(e) => { handleChange(e, 'phoneNumber'); }} />
                </label>
                <label>
                    Ulica*
                    <input className="input input--order"
                           value={fields.street}
                           onChange={(e) => { handleChange(e, 'street'); }} />
                </label>
                <div className="flex">
                    <label>
                        Nr domu*
                        <input className="input input--order"
                               value={fields.building}
                               onChange={(e) => { handleChange(e, 'building'); }} />
                    </label>
                    <label>
                        Nr lokalu
                        <input className="input input--order"
                               value={fields.flat}
                               onChange={(e) => { handleChange(e, 'flat'); }} />
                    </label>
                </div>
                <div className="flex">
                    <label>
                        Kod pocztowy*
                        <input className="input input--order"
                               value={fields.postalCode}
                               onChange={(e) => { handleChange(e, 'postalCode'); }} />
                    </label>
                    <label>
                        Miejscowość*
                        <input className="input input--order"
                               value={fields.city}
                               onChange={(e) => { handleChange(e, 'city'); }} />
                    </label>
                </div>
            </div>

            {/* INVOICE */}
            <div id="invoice">
                <span className="anchorSpan" id="invoice--mobile"></span>
                <label className="form__addons__label">
                    <button className={fields.invoice ? "form__check form__check--selected" : "form__check"}
                            type="button"
                            onClick={(e) => { handleChange(!fields.invoice, 'invoice'); }}>
                        <span></span>
                    </button>
                    <span>
                        Chcę otrzymać fakturę VAT
                </span>
                </label>
                {fields.invoice ? <div className="flex">
                    <label>
                        Nazwa firmy*
                        <input className="input input--order"
                               value={fields.companyName}
                               onChange={(e) => { handleChange(e, 'companyName'); }} />
                    </label>
                    <label>
                        NIP*
                        <input className="input input--order"
                               value={fields.nip}
                               onChange={(e) => { handleChange(e, 'nip'); }} />
                    </label>
                </div> : ''}
            </div>

            {/* DIFFERENT DELIVERY ADDRESS */}
            <div id="deliveryAddress">
                <span className="anchorSpan" id="deliveryAddress--mobile"></span>
                <label className="form__addons__label">
                    <button className={fields.differentDeliveryAddress ? "form__check form__check--selected" : "form__check"}
                            type="button"
                            onClick={() => { handleChange(!fields.differentDeliveryAddress, 'differentDeliveryAddress') }}>
                        <span></span>
                    </button>
                    <span>
                    Inny adres dostawy
                </span>
                </label>
                {fields.differentDeliveryAddress ? <>
                    <div className="flex">
                        <label>
                            Imię*
                            <input className="input input--order"
                                   value={fields.deliveryFirstName}
                                   onChange={(e) => { handleChange(e, 'deliveryFirstName'); }} />
                        </label>
                        <label>
                            Nazwisko*
                            <input className="input input--order"
                                   value={fields.deliveryLastName}
                                   onChange={(e) => { handleChange(e, 'deliveryLastName'); }} />
                        </label>
                    </div>
                    <label>
                        Nr telefonu*
                        <input className="input input--order"
                               value={fields.deliveryPhoneNumber}
                               onChange={(e) => { handleChange(e, 'deliveryPhoneNumber'); }} />
                    </label>
                    <label>
                        Ulica*
                        <input className="input input--order"
                               value={fields.deliveryStreet}
                               onChange={(e) => { handleChange(e, 'deliveryStreet'); }} />
                    </label>
                    <div className="flex">
                        <label>
                            Nr domu*
                            <input className="input input--order"
                                   value={fields.deliveryBuilding}
                                   onChange={(e) => { handleChange(e, 'deliveryBuilding'); }} />
                        </label>
                        <label>
                            Nr lokalu
                            <input className="input input--order"
                                   value={fields.deliveryFlat}
                                   onChange={(e) => { handleChange(e, 'deliveryFlat'); }} />
                        </label>
                    </div>
                    <div className="flex">
                        <label>
                            Kod pocztowy*
                            <input className="input input--order"
                                   value={fields.deliveryPostalCode}
                                   onChange={(e) => { handleChange(e, 'deliveryPostalCode'); }} />
                        </label>
                        <label>
                            Miejscowość*
                            <input className="input input--order"
                                   value={fields.deliveryCity}
                                   onChange={(e) => { handleChange(e, 'deliveryCity'); }} />
                        </label>
                    </div>
                </> : ''}
            </div>
        </form>
    </div>
};

export default OrderFormFields;
