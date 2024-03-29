import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {isLoggedIn, logoutUser} from "../../helpers/auth";
import ClientPanelStart from "../../components/shop/ClientPanelStart";
import ClientOrders from "../../components/shop/ClientOrders";
import UserData from "../../components/shop/UserData";
import LoadingPage from "../../components/shop/LoadingPage";

const ClientPanel = () => {
    const [render, setRender] = useState(false);
    const [menu, setMenu] = useState(-1);
    const [mainComponent, setMainComponent] = useState(null);

    useEffect(() => {
        isLoggedIn()
            .then((res) => {
                if(res?.status === 200) {
                    setRender(true);
                    const section = new URLSearchParams(window.location.search).get('sekcja');
                    if(section === 'zamowienia') {
                        setMenu(1);
                    }
                    else if(section === 'twoje-dane') {
                        setMenu(0);
                    }
                }
                else {
                    window.location = '/moje-konto';
                }
            })
            .catch(() => {
                window.location = '/moje-konto';
            })
    }, []);

    useEffect(() => {
        switch(menu) {
            case -1:
                setMainComponent(<ClientPanelStart />);
                break;
            case 0:
                setMainComponent(<UserData />);
                break;
            case 1:
                setMainComponent(<ClientOrders />);
                break;
            default:
                break;
        }
    }, [menu]);

    const handleMenuChange = (n) => {
        setMenu(n);
    }

    const logout = () => {
        logoutUser()
            .then((res) => {
                window.location = '/';
            });
    }

    return render ? <div className="container">
        <PageHeader />
        <main className="panel w flex">
            <div className="panel__menu">
                <h1 className="panel__header">
                    Konto
                </h1>

                <div className="panel__menu__menu">
                    <button className={menu === 0 ? "panel__menu__item panel__menu__item--selected" : "panel__menu__item"} onClick={() => { handleMenuChange(0); }}>
                        Twoje dane
                    </button>
                    <button className={menu === 1 ? "panel__menu__item panel__menu__item--selected" : "panel__menu__item"} onClick={() => { handleMenuChange(1); }}>
                        Zamówienia
                    </button>
                    <button className="panel__menu__item" onClick={() => { logout(); }}>
                        Wyloguj się
                    </button>
                </div>
            </div>

            {mainComponent}

        </main>
        <Footer />
    </div> : <LoadingPage />
};

export default ClientPanel;
