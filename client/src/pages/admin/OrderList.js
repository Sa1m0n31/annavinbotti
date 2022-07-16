import React, {useEffect, useState} from 'react';
import {deleteOrder, getAllOrders} from "../../helpers/orders";
import {deleteType} from "../../helpers/products";
import AdminTop from "../../components/admin/AdminTop";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import AdminMenu from "../../components/admin/AdminMenu";
import TypeListItem from "../../components/admin/TypeListItem";
import OrderListItem from "../../components/admin/OrderListItem";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        getAllOrders()
            .then((res) => {
                const result = res?.data?.result;
                console.log(result);
                if(result) {
                    setOrders(result);
                }
            });
    }, []);

    const openDeleteModal = (id, name) => {
        setDeleteCandidate(id);
        setDeleteCandidateName(name);
    }

    const closeDeleteModal = () => {
        setDeleteCandidate(0);
        setDeleteCandidateName('');
    }

    const deleteTypeById = () => {
        deleteOrder(deleteCandidate)
            .then((res) => {
                if(res?.status === 201) {
                    setDeleteStatus(1);
                }
                else {
                    setDeleteStatus(-1);
                }
            })
            .catch(() => {
                setDeleteStatus(-1);
            });
    }

    useEffect(() => {
        if(deleteStatus !== 0) {
            setTimeout(() => {
                setDeleteStatus(0);
                setDeleteCandidate(0);
                setDeleteCandidateName("");
            }, 2000);
        }
    }, [deleteStatus]);

    return <div className="container container--admin">
        <AdminTop />

        {deleteCandidate ? <AdminDeleteModal id={deleteCandidate}
                                             header="Usuwanie zamówienia"
                                             text={`Czy na pewno chcesz usunąć zamówienie ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Zamówienie został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteTypeById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Lista zamówień
                </h2>
                {orders?.map((item, index) => {
                    return <OrderListItem index={index}
                                         id={item.id}
                                         openDeleteModal={openDeleteModal}
                                         name={item.first_name + ' ' + item.last_name}
                                         date={item.date} />
                })}
            </main>
        </div>
    </div>
};

export default OrderList;
