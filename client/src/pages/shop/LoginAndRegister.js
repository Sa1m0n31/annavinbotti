import React, {useState} from 'react';
import LoadingPage from "../../components/shop/LoadingPage";
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import Login from "../../components/shop/Login";
import Register from "../../components/shop/Register";

const LoginAndRegister = () => {
    const [formType, setFormType] = useState(0);

    return <div className="container">
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
    </div>
};

export default LoginAndRegister;
