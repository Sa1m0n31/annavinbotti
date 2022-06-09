import React, {useEffect, useState} from 'react';
import {changeOrderStatus, getOrderById, getOrderForms, getOrderStatuses} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import AdminOrderInfo from "../../components/admin/AdminOrderInfo";
import AdminOrderCart from "../../components/admin/AdminOrderCart";

const OrderDetails = () => {
    const [order, setOrder] = useState({});
    const [cart, setCart] = useState([]);
    const [formsSettled, setFormsSettled] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [currentOrderStatus, setCurrentOrderStatus] = useState(0);
    const [orderStatusUpdateStatus, setOrderStatusUpdateStatus] = useState(0);

    useEffect(() => {
        const paramId = new URLSearchParams(window.location.search)?.get('id');

        getOrderStatuses()
            .then((res) => {
                const r = res?.data?.result;
                if(r) {
                    setStatuses(r);
                }
            });

        getOrderById(paramId)
            .then((res) => {
                const r = res?.data?.result;
                if(r) {
                    const result = r[0];
                    setOrder({
                        id: result.id,
                        date: result.date,
                        fullName: `${result.first_name} ${result.last_name}`,
                        email: result.email,
                        phoneNumber: result.phone_number,
                        userAddress: {
                            city: result.user_city,
                            street: result.user_street,
                            postalCode: result.user_postal_code,
                            building: result.user_building,
                            flat: result.user_flat
                        },
                        deliveryAddress: {
                            city: result.delivery_city,
                            street: result.user_street,
                            postalCode: result.delivery_postal_code,
                            building: result.delivery_building,
                            flat: result.delivery_flat
                        },
                        companyName: result.company_name,
                        nip: result.nip,
                        status: result.status
                    });

                    setCart(r?.map((item) => {
                        const productName = item.product_name;
                        const productAddons = r?.filter((item) => {
                            return item.product_name === productName;
                        });

                        return {
                            product: productName,
                            type: item.type,
                            price: item.price,
                            addons: productAddons?.map((item) => {
                                return {
                                    addon: item.addon_name,
                                    option: item.addon_option_name
                                }
                            })
                        }
                    })?.filter((v,i,a)=>a.findIndex(v2=>(v2.product===v.product))===i));
                }
            });
    }, []);

    const getFormByProductAndFormType = (product, formType, arr) => {
        return arr.find((item) => {
            return item.product === product && item.form === formType;
        });
    }

    useEffect(() => {
        if(cart?.length && !formsSettled) {
            const paramId = new URLSearchParams(window.location.search)?.get('id');

            if(paramId) {
                setFormsSettled(true);
                getOrderForms(paramId)
                    .then((res) => {
                        const r = res?.data?.result;
                        if(r) {
                            setCart(cart?.map((item) => {
                               const firstForm = getFormByProductAndFormType(item.product, 1, r);
                               const secondForm = getFormByProductAndFormType(item.product, 2, r);

                               return {...item, firstForm, secondForm}
                            }));
                        }
                    })
            }
        }
    }, [cart]);

    useEffect(() => {
        if(orderStatusUpdateStatus) {
            setTimeout(() => {
                setOrderStatusUpdateStatus(0);
            }, 3000);
        }
    }, [orderStatusUpdateStatus]);

    const changeOrderStatusWrapper = () => {
        if(currentOrderStatus) {
            changeOrderStatus(order?.id, currentOrderStatus)
                .then((res) => {
                    if(res?.status === 201) {
                        setOrderStatusUpdateStatus(1);
                    }
                    else {
                        setOrderStatusUpdateStatus(-1);
                    }
                })
                .catch(() => {
                    setOrderStatusUpdateStatus(-1);
                });
        }
    }

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Szczegóły zamówienia #{order?.id}
                </h2>

                <div className="admin__main__order">
                    <section className="admin__order__left">
                        {statuses?.map((item, index) => {
                            return <button className="orderStatus" onClick={() => { setCurrentOrderStatus(index+1); }}>
                            <span className={(index + 1 === order.status && !currentOrderStatus) || (index + 1 === currentOrderStatus) ? "orderStatus__number orderStatus__number--currentStatus" : "orderStatus__number"}>
                                {index+1}
                            </span>
                                <p className="orderStatus__text">
                                    {item.name_pl}
                                </p>
                            </button>
                        })}
                        {!orderStatusUpdateStatus ? <button className="btn btn--admin btn--orderStatus" onClick={() => { changeOrderStatusWrapper(); }}>
                            Zmień status zamówienia
                        </button> : <span className="info info--orderStatus">
                        {orderStatusUpdateStatus === 1 ? 'Status zamówienia został zmieniony' : 'Coś poszło nie tak... Skontaktuj się z administratorem systemu'}
                    </span>}
                    </section>

                    <section className="admin__order__right">
                        <AdminOrderInfo order={order} />
                        <AdminOrderCart cart={cart} />
                    </section>
                </div>
            </main>
        </div>
    </div>
};

export default OrderDetails;
