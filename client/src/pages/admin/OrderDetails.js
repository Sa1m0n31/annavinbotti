import React, {useEffect, useState} from 'react';
import {
    changeOrderStatus,
    getOrderById,
    getOrderForms,
    getOrderStatuses,
    updateDeliveryNumber
} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import AdminOrderInfo from "../../components/admin/AdminOrderInfo";
import AdminOrderCart from "../../components/admin/AdminOrderCart";
import {cancelOrder, rejectClientForm} from "../../helpers/admin";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";

const OrderDetails = () => {
    const [order, setOrder] = useState({});
    const [cart, setCart] = useState([]);
    const [formsSettled, setFormsSettled] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const [currentOrderStatus, setCurrentOrderStatus] = useState(0);
    const [orderStatusUpdateStatus, setOrderStatusUpdateStatus] = useState(0);
    const [infoForClient, setInfoForClient] = useState('');
    const [cancelOrderStatus, setCancelOrderStatus] = useState(0);
    const [rejectClientFormStatus, setRejectClientFormStatus] = useState('');
    const [cancelOrderModal, setCancelOrderModal] = useState(false);
    const [deliveryNumber, setDeliveryNumber] = useState('');
    const [changeDeliveryNumberStatus, setChangeDeliveryNumberStatus] = useState('');

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
                    setDeliveryNumber(result.delivery_number);
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
                        console.log(item);
                        const productName = item.product_name;
                        const productAddons = r?.filter((item) => {
                            return item.product_name === productName;
                        });

                        return {
                            productId: item.product_id,
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
            changeOrderStatus(order?.id, currentOrderStatus, order?.email)
                .then((res) => {
                    console.log(res);
                    if(res?.status === 201 || res?.status === 200) {
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

    const sendInfoForClient = () => {
        rejectClientForm(infoForClient, order.email, order.id)
            .then((res) => {
               if(res?.status === 201) {
                    setRejectClientFormStatus('Prośba o uzupełnienie informacji została wysłana');
               }
               else {
                   setRejectClientFormStatus('Coś poszło nie tak... Prosimy spróbować później lub skontaktować się z administratorem systemu');
               }
            })
            .catch(() => {
                setRejectClientFormStatus('Coś poszło nie tak... Prosimy spróbować później lub skontaktować się z administratorem systemu');
            });
    }

    const cancelOrderWrapper = () => {
        cancelOrder(order.id, order.email)
            .then((res) => {
                if(res?.status === 201) {
                    setCancelOrderStatus(1);
                }
                else {
                    setCancelOrderStatus(-1);
                }
            })
            .catch(() => {
                setCancelOrderStatus(-1);
            });
    }

    useEffect(() => {
        if(rejectClientFormStatus) {
            setInfoForClient('');
        }
    }, [rejectClientFormStatus]);

    const changeOrderDeliveryNumber = () => {
        updateDeliveryNumber(order.id, deliveryNumber)
            .then((res) => {
                if(res?.status === 201) {
                    setChangeDeliveryNumberStatus('Numer przesyłki został zaktualizowany');
                }
                else {
                    setChangeDeliveryNumberStatus('Coś poszło nie tak.. Prosimy spróbować później lub skontaktować się z administratorem.');
                }
            })
            .catch(() => {
                setChangeDeliveryNumberStatus('Coś poszło nie tak.. Prosimy spróbować później lub skontaktować się z administratorem.');
            });
    }

    return <div className="container container--admin">
        <AdminTop />

        {cancelOrderModal ? <AdminDeleteModal id={order.id}
                                              header="Anulowanie zamówienia"
                                              text={`Czy na pewno chcesz anulować zamówienie #${order.id}?`}
                                              btnText="Anuluj"
                                              success="Zamówienie zostało anulowane"
                                              fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                              deleteStatus={cancelOrderStatus}
                                              deleteFunction={cancelOrderWrapper}
                                              closeModalFunction={() => { setCancelOrderModal(false); }} /> : ''}

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
                        <AdminOrderCart cart={cart} orderId={order?.id} />

                        <div className="admin__order__sendInfo">
                            {order?.status === 2 ? <div>
                                <h3 className="admin__order__sendInfo__header">
                                    Poproś klienta o uzupełnienie niepełnych danych
                                </h3>
                                <textarea className="input input--textarea"
                                          placeholder="Napisz, co powinien uzupełnić Klient..."
                                          value={infoForClient}
                                          onChange={(e) => { setInfoForClient(e.target.value); }} />
                                {rejectClientFormStatus ? <span className="info info--infoForClient">
                                    {rejectClientFormStatus}
                                </span> : <button className="btn btn--admin btn--admin--send"
                                                  onClick={() => { sendInfoForClient(); }}>
                                    Odrzuć wymiary
                                </button>}
                            </div> : ''}
                            <div>
                                <h3 className="admin__order__sendInfo__header">
                                    Edytuj numer przesyłki
                                </h3>
                                <input className="input input--deliveryNumber"
                                       placeholder="Numer przesyłki"
                                       value={deliveryNumber}
                                       onChange={(e) => { setDeliveryNumber(e.target.value); }} />

                                {changeDeliveryNumberStatus ? <span className="info info--infoForClient">
                                    {changeDeliveryNumberStatus}
                                </span> : <button className="btn btn--admin btn--admin--send"
                                                  onClick={() => { changeOrderDeliveryNumber(); }}>
                                    Zmień numer przesyłki
                                </button>}

                            </div>
                            <div>
                                <h3 className="admin__order__sendInfo__header">
                                    Anuluj zamówienie
                                </h3>
                                <button className="btn btn--danger"
                                        onClick={() => { setCancelOrderModal(true); }}>
                                    Anuluj zamówienie
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </div>
};

export default OrderDetails;
