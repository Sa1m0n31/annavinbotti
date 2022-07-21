import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getOrderById, getOrderStatuses} from "../../helpers/orders";
import {getOrdersWithEmptyFirstTypeForms, getOrdersWithEmptySecondTypeForms, logout} from "../../helpers/user";
import {ContentContext} from "../../App";
import {getDate, getNumberOfFirstTypeForms, getNumberOfSecondTypeForms, groupBy} from "../../helpers/others";
import constans from "../../helpers/constants";
import {getFormByStatus, isFormFilled} from "../../components/shop/ClientOrders";
import {isLoggedIn} from "../../helpers/auth";
import LoadingPage from "../../components/shop/LoadingPage";

const OrderDetails = () => {
    const { language, content } = useContext(ContentContext);

    const [render, setRender] = useState(false);
    const [orderInfo, setOrderInfo] = useState([]);
    const [orderDetails, setOrderDetails] = useState({});
    const [cart, setCart] = useState([]);
    const [orderSum, setOrderSum] = useState(0);
    const [statuses, setStatuses] = useState([]);
    const [buttons, setButtons] = useState([]);
    const [products, setProducts] = useState([]);
    const [ordersWithEmptyFirstTypeForms, setOrdersWithEmptyFirstTypeForms] = useState([]);
    const [ordersWithEmptySecondTypeForms, setOrdersWithEmptySecondTypeForms] = useState([]);

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');

        if(id) {
            isLoggedIn()
                .then((res) => {
                    if(res?.status === 200) {
                        setRender(true);

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
                                const r = res?.data?.result;
                                if(r) {
                                    setStatuses(r);
                                }
                                else {
                                    window.location = '/panel-klienta';
                                }
                            })
                            .catch(() => {
                                window.location = '/panel-klienta';
                            });

                        getOrderById(id)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setOrderInfo(res?.data?.result);
                                    const order = res?.data?.result[0];
                                    setOrderDetails({
                                        id: order.id,
                                        date: order.date,
                                        status: order.status,
                                        shipping: order.shipping,
                                        payment: order.payment,
                                        userData: {
                                            firstName: order.first_name,
                                            lastName: order.last_name,
                                            email: order.email,
                                            phoneNumber: order.phone_number,
                                            street: order.user_street,
                                            building: order.user_building,
                                            flat: order.user_flat,
                                            city: order.city,
                                            postalCode: order.postal_code
                                        },
                                        deliveryData: {
                                            firstName: order.delivery_first_name,
                                            lastName: order.delivery_last_name,
                                            phoneNumber: order.delivery_phone_number,
                                            street: order.delivery_street,
                                            building: order.delivery_building,
                                            flat: order.delivery_flat,
                                            city: order.delivery_city,
                                            postalCode: order.delivery_postal_code
                                        }
                                    });
                                }
                                else {
                                    window.location = '/panel-klienta';
                                }
                            })
                            .catch((err) => {
                                window.location = '/panel-klienta';
                            });
                    }
                    else {
                        window.location = '/';
                    }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
        else {
            window.location = '/panel-klienta';
        }
    }, []);

    useEffect(() => {
        if(cart) {
            setProducts(Object.entries(groupBy(cart, 'sell')));
        }
    }, [cart]);

    useEffect(() => {
       if(orderInfo?.length) {
           if(language === 'en') {
               setCart(orderInfo?.map((item) => {
                   return {
                       sell: item.sell_id,
                       product: item.product_name_en,
                       addon: item.addon_name_en,
                       addonOption: item.addon_option_name_en,
                       price: item.price,
                       type: item.type_id,
                       img: item.main_image
                   }
               }));
           }
           else {
               setCart(orderInfo?.map((item) => {
                   return {
                       sell: item.sell_id,
                       product: item.product_name,
                       addon: item.addon_name,
                       addonOption: item.addon_option_name,
                       price: item.price,
                       type: item.type_id,
                       img: item.main_image
                   }
               }));
           }
       }
    }, [orderInfo, language]);

    useEffect(() => {
        if(orderDetails && cart) {
            if(orderDetails.status === 1) {
                setButtons(getNumberOfFirstTypeForms(cart).map((item) => {
                    return {
                        pl: 'Podaj wymiary stopy',
                        en: 'Podaj wymiary stopy',
                        link: `/formularz-mierzenia-stopy?zamowienie=${orderDetails.id}&typ=${item}`
                    }
                }));
            }
            else if(orderDetails.status === 3) {
                setButtons([
                    {
                        pl: 'Opłać zamówienie',
                        en: 'Pay',
                        link: `/oplac-zamowienie?id=${orderDetails.id}`
                    }
                ]);
            }
            else if(orderDetails.status === 5) {
                setButtons(getNumberOfSecondTypeForms(cart).map((item) => {
                    return {
                        pl: 'Zweryfikuj but na miarę',
                        en: 'Zweryfikuj but na miarę',
                        link: `/formularz-weryfikacji-buta?zamowienie=${orderDetails.id}&model=${item}`
                    }
                }));
            }
        }
    }, [orderDetails, cart]);

    useEffect(() => {
        if(cart) {
            setOrderSum(Object.entries(groupBy(cart, 'sell')).reduce((prev, cur) => {
                return prev + cur[1][0].price;
            }, 0));
        }
    }, [cart]);

    return render ? <div className="container">
        <PageHeader />
        <main className="panel w flex">
            <div className="panel__menu">
                <h1 className="panel__header">
                    Konto
                </h1>

                <div className="panel__menu__menu">
                    <button className="panel__menu__item" onClick={() => { window.location = '/panel-klienta?sekcja=twoje-dane' }}>
                        Twoje dane
                    </button>
                    <button className="panel__menu__item panel__menu__item--selected" onClick={() => { window.location = '/panel-klienta?sekcja=zamowienia' }}>
                        Zamówienia
                    </button>
                    <button className="panel__menu__item" onClick={() => { logout(); }}>
                        Wyloguj się
                    </button>
                </div>
            </div>

            <div className="panel__main panel__main--orderDetails">
                <h2 className="orderDetails__header">
                    Dane zamówienia
                </h2>

                <div className="orderDetails__mainInfo flex">
                    <div className="orderDetails__mainInfo__section">
                        <span className="orderDetails__mainInfo__section__key">
                            Numer
                        </span>
                        <span className="orderDetails__mainInfo__section__value">
                            #{orderDetails.id}
                        </span>
                    </div>
                    <div className="orderDetails__mainInfo__section">
                        <span className="orderDetails__mainInfo__section__key">
                            Data zamówienia
                        </span>
                        <span className="orderDetails__mainInfo__section__value">
                            {getDate(orderDetails.date)}
                        </span>
                    </div>
                    <div className="orderDetails__mainInfo__section">
                        <span className="orderDetails__mainInfo__section__key">
                            Suma
                        </span>
                        <span className="orderDetails__mainInfo__section__value">
                            {orderSum} zł
                        </span>
                    </div>
                    <div className="orderDetails__mainInfo__section">
                        <span className="orderDetails__mainInfo__section__key">
                            Sposób dostawy
                        </span>
                        <span className="orderDetails__mainInfo__section__value">
                            {orderDetails.shipping}
                        </span>
                    </div>
                </div>

                <section className="orderDetails__statuses">
                    {statuses?.map((item, index) => {
                        return <div className="orderStatus">
                            <span className={(index + 1 === orderDetails.status) ? "orderStatus__number orderStatus__number--currentStatus" : "orderStatus__number"}>
                                {index+1}
                            </span>
                            <p className="orderStatus__text">
                                {language === 'pl' ? item.name_pl : item.name_en}

                                {/* BUTTONS */}
                                {(index === 0 && orderDetails.status === 1) ||
                                (index === 2 && orderDetails.status === 3) ||
                                (index === 4 && orderDetails.status === 5)
                                    ? <span className="orderStatus__buttons">
                                    {buttons?.map((item, index) => {
                                        const formFilled = isFormFilled(getFormByStatus(orderDetails.status), item?.link,
                                            orderDetails.status === 1 ? ordersWithEmptyFirstTypeForms : ordersWithEmptySecondTypeForms);
                                        return <a href={item.link}
                                                  key={index}
                                                  className={formFilled ? "btn btn--orderDetails btn--orderList--hidden" : "btn btn--orderDetails"}>
                                            {formFilled ? (language === 'pl' ? "Zobacz formularz" : 'See form') : (language === 'pl' ? item?.pl : item?.en)}
                                        </a>
                                    })}
                                </span> : ''}
                            </p>
                        </div>
                    })}
                </section>

                <section className="orderDetails__bottom">
                    <h3 className="orderDetails__header">
                        Podsumowanie zamówienia
                    </h3>

                    {products?.map((item, index) => {
                        return <div className="orderDetails__bottom__item flex" key={index}>
                            <figure className="orderDetails__bottom__item__figure">
                                <img className="img" src={`${constans.IMAGE_URL}/media/products/${item[1][0].img}`} />
                            </figure>
                            <div className="orderDetails__bottom__item__content">
                                <h4 className="orderDetails__bottom__item__content__header">
                                    {language === 'pl' ? item[1][0].product : item[1][0].product_name_en}
                                </h4>
                                <h5 className="orderDetails__bottom__item__content__price">
                                    {item[1][0].price} zł
                                </h5>
                                <div className="orderDetails__bottom__item__addons" key={index}>
                                    {item[1]?.map((item, index) => {
                                        return <p className="orderDetails__bottom__item__addon">
                                            <span className="orderDetails__bottom__item__key">
                                                {item.addon}:
                                            </span>
                                            <span className="orderDetails__bottom__item__value">
                                                {item.addonOption}
                                            </span>
                                        </p>
                                    })}
                                </div>
                            </div>
                        </div>
                    })}

                    {orderDetails?.deliveryData ? <section className="orderDetails__bottom__section">
                        <h5 className="orderDetails__bottom__section__header">
                            Adres dostawy
                        </h5>
                        <p>
                            {orderDetails.deliveryData.street} {orderDetails.deliveryData.building}{orderDetails.deliveryData.flat ? `/${orderDetails.deliveryData.flat}` : ''}
                        </p>
                        <p>
                            {orderDetails.deliveryData.postalCode} {orderDetails.deliveryData.city}
                        </p>
                        <p className="marginTop">
                            {orderDetails.userData.email}
                        </p>
                        <p>
                            {orderDetails.deliveryData.phoneNumber}
                        </p>
                    </section> : ''}
                    <section className="orderDetails__bottom__section">
                        <h5 className="orderDetails__bottom__section__header">
                            Metoda płatności
                        </h5>
                        <p>
                            {orderDetails?.payment === 1 ? 'Przelew tradycyjny' : 'Płatności internetowe'}
                        </p>
                    </section>
                    <section className="orderDetails__bottom__section orderDetails__bottom__section--last">
                        <h5 className="orderDetails__bottom__section__header">
                            Suma: {orderSum} zł
                        </h5>
                        <h5 className="orderDetails__bottom__section__header">
                            Dostawa: bezpłatna
                        </h5>
                        <h5 className="orderDetails__bottom__section__header">
                            Razem: {orderSum} zł
                        </h5>
                    </section>
                </section>
            </div>

        </main>
        <Footer />
    </div> : <LoadingPage />
};

export default OrderDetails;
