import React, {useContext, useEffect, useState} from 'react';
import {getUserInfo, updateUser} from "../../helpers/user";
import Loader from "./Loader";
import {isAlphanumeric, isEmail, validatePhoneNumberChange, validatePostalCodeChange} from "../../helpers/others";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const UserData = () => {
    const { language, content } = useContext(ContentContext);

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [dataChanged, setDataChanged] = useState(false);

    useEffect(() => {
        getUserInfo()
            .then((res) => {
                if(res?.status === 200) {
                    setUser(res?.data?.result[0]);
                }
            });
    }, []);

    const handleChange = (event, fieldId) => {
        setDataChanged(true);
        let newFields = { ...user };

        if(fieldId === 'phone_number') {
            if(validatePhoneNumberChange(event.target.value)) {
                newFields[fieldId] = event.target.value;
            }
        }
        else if(fieldId === 'postal_code') {
            newFields[fieldId] = validatePostalCodeChange(user.postal_code, event.target.value);
        }
        else if(fieldId === 'flat' || fieldId === 'building') {
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
        else {
            newFields[fieldId] = typeof event !== "boolean" ? event.target.value : event;
        }

        setUser(newFields);
    }

    const updateUserData = () => {
        if(dataChanged) {
            setLoading(true);
            if(!isEmail(user.email)) {
                setStatus(-2);
            }
            else {
                updateUser(user.id, user.address, user.first_name, user.last_name,
                    user.email, user.phone_number, user.street, user.building,
                    user.flat, user.postal_code, user.city)
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(1);
                        }
                        else {
                            setStatus(-1);
                        }
                    })
                    .catch(() => {
                        setStatus(-1);
                    });
            }
        }
    }

    useEffect(() => {
        if(status) {
            setLoading(false);
        }
    }, [status]);

    return <div className="panel__main panel__main--data">
        <h2 className="orderDetails__header">
            Twoje dane
        </h2>
        <div id="personalData">
            <label>
                E-mail*
                <input className="input input--order"
                       value={user.email}
                       onChange={(e) => { handleChange(e, 'email'); }} />
            </label>
            <div className="flex">
                <label>
                    Imię
                    <input className="input input--order"
                           value={user.first_name}
                           onChange={(e) => { handleChange(e, 'first_name'); }} />
                </label>
                <label>
                    Nazwisko
                    <input className="input input--order"
                           value={user.last_name}
                           onChange={(e) => { handleChange(e, 'last_name'); }} />
                </label>
            </div>
            <label>
                Nr telefonu*
                <input className="input input--order"
                       value={user.phone_number}
                       onChange={(e) => { handleChange(e, 'phone_number'); }} />
            </label>
            <label>
                Ulica*
                <input className="input input--order"
                       value={user.street}
                       onChange={(e) => { handleChange(e, 'street'); }} />
            </label>
            <div className="flex">
                <label>
                    Nr domu*
                    <input className="input input--order"
                           value={user.building}
                           onChange={(e) => { handleChange(e, 'building'); }} />
                </label>
                <label>
                    Nr lokalu
                    <input className="input input--order"
                           value={user.flat}
                           onChange={(e) => { handleChange(e, 'flat'); }} />
                </label>
            </div>
            <div className="flex">
                <label>
                    Kod pocztowy*
                    <input className="input input--order"
                           value={user.postal_code}
                           onChange={(e) => { handleChange(e, 'postal_code'); }} />
                </label>
                <label>
                    Miejscowość*
                    <input className="input input--order"
                           value={user.city}
                           onChange={(e) => { handleChange(e, 'city'); }} />
                </label>
            </div>

            {status === 1 ? <span className="info">
                Twoje dane zostały zaktualizowane
            </span> : (status !== 0 ? <span className="info info--error">
                {status === -1 ? (language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN)
                    : (language === 'pl' ? 'Wpisz poprawny adres e-mail' : 'Fill your e-mail')
                }
            </span> : '')}

            {loading ? <div className="center">
                <Loader />
            </div> : <button className="btn btn--editData" onClick={() => { updateUserData(); }}>
                Zaktualizuj swoje dane
            </button>}
        </div>
    </div>
};

export default UserData;
