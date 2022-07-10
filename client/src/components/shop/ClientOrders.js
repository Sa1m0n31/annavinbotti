import React, {useContext, useEffect, useState} from 'react';
import {getUserOrders} from "../../helpers/user";
import {getDate, groupBy, statusButtons} from "../../helpers/others";
import {getOrderStatuses} from "../../helpers/orders";
import {ContentContext} from "../../App";
import Loader from "./Loader";

const ClientOrders = () => {
    const { language, content } = useContext(ContentContext);

    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        getUserOrders()
            .then((res) => {
                if(res?.status === 200) {
                    setOrders(Object.entries(groupBy(res?.data?.result, 'id')));
                }
            });

        getOrderStatuses()
            .then((res) => {
                if(res?.status === 200) {
                    setStatuses(res?.data?.result);
                }
            });
    }, []);

    useEffect(() => {
        if(orders?.length) {
            setButtons(orders.map((item) => {
                return setButtonParams(item.id, item[1][0].status, item[1]);
            }));
            setRender(true);
        }
    }, [orders, statuses]);

    const getNumberOfFirstTypeForms = (cart) => {
        const groupedByType = Object.entries(groupBy(cart, 'type'));
        return groupedByType.map((item) => {
            return item[0];
        });
    }

    const getNumberOfSecondTypeForms = (cart) => {
        const groupedByModel = Object.entries(groupBy(cart, 'product'));
        return groupedByModel.map((item) => {
            return item[0];
        });
    }

    const setButtonParams = (orderId, status, cart) => {
        if(status === 1) {
            return getNumberOfFirstTypeForms(cart).map((item) => {
                return {
                    pl: 'Podaj wymiary stopy',
                    en: 'Podaj wymiary stopy',
                    link: `/formularz-mierzenia-stopy?zamowienie=${orderId}&typ=${item}`
                }
            })
        }
        else if(status === 2) {
            return [
                {
                    pl: 'Opłać zamówienie',
                    en: 'Pay',
                    link: `/oplac-zamowienie?id=${orderId}`
                }
            ]
        }
        else if(status === 4) {
            return getNumberOfSecondTypeForms(cart).map((item) => {
                return {
                    pl: 'Zweryfikuj but na miarę',
                    en: 'Zweryfikuj but na miarę',
                    link: `/formularz-weryfikacji-buta?zamowienie=${orderId}&model=${item}`
                }
            });
        }
        else {
            return [
                {
                    pl: 'Szczegóły',
                    en: 'Details',
                    link: `/szczegoly?id=${orderId}`
                }
            ]
        }
    }

    return <div className="panel__main panel__main--start">
        {render ? <div className="ordersTable">
            <div className="ordersTable__header flex">
                <span className="ordersTable__cell">
                    Numer
                </span>
                <span className="ordersTable__cell">
                    Data
                </span>
                <span className="ordersTable__cell">
                    Status
                </span>
                <span className="ordersTable__cell">
                    Więcej
                </span>
            </div>
            {orders?.map((item, index) => {
                return <div className="ordersTable__row flex" key={index}>
                    <a href={`/zamowienie?id=${item[0]}`} className="ordersTable__row__cell">
                        #{item[0]}
                    </a>
                    <span className="ordersTable__row__cell">
                        {getDate(item[1][0].date)}
                    </span>
                    <span className="ordersTable__row__cell">
                        {language === 'pl' ? statuses[item[1][0]?.status]?.name_pl : statuses[item[1][0]?.status]?.name_en}
                    </span>
                    <span className="ordersTable__row__cell ordersTable__row__cell--buttonsWrapper">
                        {buttons[index]?.map((item, index) => {
                            return <a href={item?.link}
                                      key={index}
                                      className="btn btn--orderList">
                                {language === 'pl' ? item?.pl : item?.en}
                            </a>
                        })}
                    </span>
                </div>
            })}
        </div> : <div className="center marginTop">
            <Loader />
        </div>}
    </div>
};

export default ClientOrders;
