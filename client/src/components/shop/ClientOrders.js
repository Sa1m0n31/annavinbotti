import React, {useContext, useEffect, useState} from 'react';
import {
    getOrdersWithEmptyFirstTypeForms,
    getOrdersWithEmptyForms,
    getOrdersWithEmptySecondTypeForms,
    getUserOrders
} from "../../helpers/user";
import {
    getDate,
    getNumberOfFirstTypeForms,
    getNumberOfSecondTypeForms,
    groupBy,
    statusButtons
} from "../../helpers/others";
import {getOrderStatuses} from "../../helpers/orders";
import {ContentContext} from "../../App";
import Loader from "./Loader";

const getFormByStatus = (status) => {
    if(status === 1) return 1;
    else if(status === 5) return 2;
    else return 3;
}

const isFormFilled = (formType, link, ordersList) => {
    if(formType > 2) {
        return false;
    }

    const params = new URL(`https://annavinbotti.com${link}`);
    const orderId = params.searchParams.get('zamowienie');
    const type = parseInt(params.searchParams.get('typ'));
    const model = parseInt(params.searchParams.get('model'));

    return ordersList?.findIndex((item) => {
        return item.order_id === orderId && item.type === (formType === 1 ? type : model);
    }) === -1;
}

const ClientOrders = () => {
    const { language, content } = useContext(ContentContext);

    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [ordersWithEmptyFirstTypeForms, setOrdersWithEmptyFirstTypeForms] = useState([]);
    const [ordersWithEmptySecondTypeForms, setOrdersWithEmptySecondTypeForms] = useState([]);
    const [render, setRender] = useState(false);
    const [emptyOrderList, setEmptyOrderList] = useState(false);

    useEffect(() => {
        getUserOrders()
            .then((res) => {
                if(res?.status === 200) {
                    setOrders(Object.entries(groupBy(res?.data?.result, 'id')));
                    setRender(true);
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
               window.location = '/';
            });

        getOrdersWithEmptyFirstTypeForms()
            .then((res) => {
                if(res?.status === 200) {
                    setOrdersWithEmptyFirstTypeForms(res?.data?.result);
                }
            });

        getOrdersWithEmptySecondTypeForms()
            .then((res) => {
                if(res?.status === 200) {
                    setOrdersWithEmptySecondTypeForms(res?.data?.result);
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
            setEmptyOrderList(false);
            setButtons(orders.map((item) => {
                return setButtonParams(item[0], item[1][0].status, item[1]);
            }));
        }
        else if(orders?.length === 0) {
            setEmptyOrderList(true);
        }
    }, [orders, statuses]);

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
        else if(status === 3) {
            return [
                {
                    pl: 'Opłać zamówienie',
                    en: 'Pay',
                    link: `/oplac-zamowienie?id=${orderId}`
                }
            ]
        }
        else if(status === 5) {
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
                    link: `/informacje-o-zamowieniu?id=${orderId}`
                }
            ]
        }
    }

    return <div className="panel__main panel__main--start">
        {render ? (emptyOrderList ? <div className="emptyOrderList">
            <h2 className="shipping__header">
                Nie masz jeszcze żadnych zamówień...
            </h2>
        </div> : <div className="ordersTable">
            <div className="ordersTable__header flex d-desktop">
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
                const orderId = item[0];
                const parentItem = item;
                return <div className="ordersTable__row flex" key={index}>
                    <a href={`/informacje-o-zamowieniu?id=${orderId}`} className="ordersTable__row__cell">
                        #{orderId}
                    </a>
                    <span className="ordersTable__row__cell">
                        {getDate(item[1][0].date)}
                    </span>
                    <span className="ordersTable__row__cell">
                        {language === 'pl' ? statuses[item[1][0]?.status-1]?.name_pl : statuses[item[1][0]?.status-1]?.name_en}
                    </span>
                    <span className="ordersTable__row__cell ordersTable__row__cell--buttonsWrapper">
                        {buttons[index]?.map((item, index) => {
                            const formFilled = isFormFilled(getFormByStatus(parentItem[1][0]?.status), item?.link,
                                parentItem[1][0]?.status === 1 ? ordersWithEmptyFirstTypeForms : ordersWithEmptySecondTypeForms);
                            return <a href={item?.link}
                                      key={index}
                                      className={formFilled ? "btn btn--orderList btn--orderList--hidden" : "btn btn--orderList"}>
                                {formFilled ? (language === 'pl' ? "Zobacz formularz" : 'See form') : (language === 'pl' ? item?.pl : item?.en)}
                            </a>
                        })}
                    </span>
                </div>
            })}
        </div>) : <div className="center marginTop">
            <Loader />
        </div>}
    </div>
};

export default ClientOrders;
export { getFormByStatus, isFormFilled }
