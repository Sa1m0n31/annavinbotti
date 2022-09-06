import React, {useEffect, useState} from 'react';
import {getAllOrders} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import OrderListItem from "../../components/admin/OrderListItem";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusSort, setStatusSort] = useState(0);
    const [dateSort, setDateSort] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getAllOrders()
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    setFilteredOrders(result);
                    setOrders(result);
                }
            });
    }, []);

    useEffect(() => {
        if(search) {
            setFilteredOrders(orders?.filter((item) => {
                return item.id.includes(search);
            }));
        }
        else {
            setFilteredOrders(orders);
        }
    }, [orders, search]);

    const sortByStatus = () => {
        if(statusSort === 0 || statusSort === -1) {
            setStatusSort(1);
            setOrders(prevState => (prevState.sort((a, b) => {
                return a.status > b.status ? 1 : -1;
            })));
        }
        else if(statusSort === 1) {
            setStatusSort(-1);
            setOrders(prevState => (prevState.sort((a, b) => {
                return a.status < b.status ? 1 : -1;
            })));
        }
    }

    const sortByDate = () => {
        if(dateSort === 0 || dateSort === -1) {
            setDateSort(1);
            setOrders(prevState => (prevState.sort((a, b) => {
                return a.date > b.date ? 1 : -1;
            })));
        }
        else if(dateSort === 1) {
            setDateSort(-1);
            setOrders(prevState => (prevState.sort((a, b) => {
                return a.date < b.date ? 1 : -1;
            })));
        }
    }

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <div className="admin__main__top">
                    <h2 className="admin__main__header">
                        Lista zamówień
                    </h2>
                    <button className="btn btn--sort" onClick={() => { sortByStatus(); }}>
                        Sortuj wg statusu
                    </button>
                    <button className="btn btn--sort" onClick={() => { sortByDate(); }}>
                        Sortuj wg daty
                    </button>
                    <div className="admin__main__top__finder">
                        <p>
                            Wyszukaj po id zamówienia
                        </p>
                        <input className="input"
                               value={search}
                               onChange={(e) => { setSearch(e.target.value); }}
                               placeholder="Wpisz id zamówienia" />
                    </div>
                </div>
                {filteredOrders?.map((item, index) => {
                    return <OrderListItem index={index}
                                         id={item.id}
                                         status={item.status}
                                         name={item.first_name + ' ' + item.last_name}
                                         date={item.date} />
                })}
            </main>
        </div>
    </div>
};

export default OrderList;
