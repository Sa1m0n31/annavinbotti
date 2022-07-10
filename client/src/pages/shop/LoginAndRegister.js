import React, {useEffect, useState} from 'react';
import LoadingPage from "../../components/shop/LoadingPage";
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import Login from "../../components/shop/Login";
import Register from "../../components/shop/Register";
import {isLoggedIn} from "../../helpers/auth";

const LoginAndRegister = () => {
    const [formType, setFormType] = useState(0);
    const [render, setRender] = useState(false);

    useEffect(() => {
        isLoggedIn()
            .then((res) => {
                if(res?.status === 200) {
                    window.location = '/panel-klienta';
                }
                else {
                    setRender(true);
                }
            })
            .catch(() => {
               setRender(true);
            });
    }, []);

    return render ? <div className="container">
            <PageHeader />
            <main className="loginAndRegister">
                <div className="loginAndRegister__header flex">
                    <button className={formType === 0 ? "loginAndRegister__btn loginAndRegister__btn--selected" : "loginAndRegister__btn" }
                            onClick={() => { setFormType(0); }}>
                        Logowanie
                    </button>
                    <button className={formType === 1 ? "loginAndRegister__btn loginAndRegister__btn--selected" : "loginAndRegister__btn" }
                            onClick={() => { setFormType(1); }}>
                        Rejestracja
                    </button>
                </div>

                <div className="loginAndRegister__form">
                    {formType === 0 ? <Login setFormType={setFormType} /> : <Register />}
                </div>
            </main>
            <Footer />
        </div> : <LoadingPage />
};

export default LoginAndRegister;
