import React, {useContext, useEffect, useRef, useState} from 'react';
import Loader from "../shop/Loader";
import {isEmail} from "../../helpers/others";
import {addToWaitlist} from "../../helpers/orders";
import constans from "../../helpers/constants";
import {LanguageContext} from "../../App";

const RedirectionInfoModal = ({closeModalFunction}) => {
    useEffect(() => {
        document.addEventListener('keyup', (event) => {
            if(event.keyCode === 27) {
                closeModalFunction();
            }
        });
    }, []);

    return <div className="colorModal colorModal--redirection">
        <div className="colorModal__inner">
            <button className="colorModal__close" onClick={() => { closeModalFunction(); }}>
                &times;
            </button>

            <h3 className="colorModal__header">
                Wybierz dodatki
            </h3>
            <p className="colorModal__text">
                Przekierowaliśmy Cię na stronę modelu, gdyż przed dodaniem produktu do koszyka konieczny jest wybór dodatków.
            </p>
            <button className="btn btn--changeColor btn--success"
                    onClick={() => { closeModalFunction(); }}>
                Wybierz dodatki
            </button>
        </div>
    </div>
};

export default RedirectionInfoModal;
