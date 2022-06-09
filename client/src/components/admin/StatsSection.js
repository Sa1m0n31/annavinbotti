import React, {useEffect, useState} from 'react';
import {getStats} from "../../helpers/content";

const StatsSection = () => {
    const [orders, setOrders] = useState(null);
    const [clients, setClients] = useState(null);
    const [newsletter, setNewsletter] = useState(null);
    const [products, setProducts] = useState(null);
    const [blog, setBlog] = useState(null);
    const [waitlist, setWaitlist] = useState(null);

    useEffect(() => {
        const setFunctions = [setOrders, setClients, setNewsletter, setProducts, setBlog, setWaitlist];
        const stats = ['orders', 'clients', 'newsletter', 'products', 'blog', 'waitlist'];

        stats?.forEach((item, index) => {
            getStats(item)
                .then((res) => {
                    const value = res?.data?.result[0]?.counter;
                    setFunctions[index](value);
                });
        });
    }, []);

    return <div className="admin__start__section">
        <h3 className="admin__start__section__header">
            Statystyki
        </h3>
        <div className="admin__start__statsWrapper">
            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {orders}
                </span>
                <span className="admin__start__stats__key">
                    Zamówienia
                </span>
            </div>
            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {clients}
                </span>
                <span className="admin__start__stats__key">
                   Zarejestrowani klienci
                </span>
            </div>
            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {newsletter}
                </span>
                <span className="admin__start__stats__key">
                    Zapisani na newsletter
                </span>
            </div>

            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {products}
                </span>
                <span className="admin__start__stats__key">
                    Dostępne produkty
                </span>
            </div>
            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {blog}
                </span>
                <span className="admin__start__stats__key">
                    Wpisy na blogu
                </span>
            </div>
            <div className="admin__start__stats">
                <span className="admin__start__stats__value">
                    {waitlist}
                </span>
                <span className="admin__start__stats__key">
                    Zapisani na waitlisty
                </span>
            </div>
        </div>
    </div>
};

export default StatsSection;
