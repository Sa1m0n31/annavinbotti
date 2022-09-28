import React, {useEffect, useState} from 'react';
import logo from '../../static/img/logo.png'
import {Helmet} from "react-helmet";
import {loginAdmin, secondLoginAdmin} from "../../helpers/auth";
import Loader from "../../components/shop/Loader";
import Cookies from 'universal-cookie';

const AdminLogin = () => {
    const [code, setCode] = useState('');
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [secondAuth, setSecondAuth] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdminLogin = () => {
        if(login && password) {
            setLoading(true);
            loginAdmin(login, password)
                .then((res) => {
                    if(res?.status === 201) {
                        setError('');
                        setLoading(false);
                        setSecondAuth(true);
                    }
                    else {
                        setError('Niepoprawny login lub hasło');
                    }
                })
                .catch(() => {
                    setError('Niepoprawny login lub hasło');
                });
        }
        else {
            setError('Wpisz login i hasło');
        }
    }

    useEffect(() => {
        if(error) {
            setLoading(false);
        }
    }, [error]);

    const handleAdminAuth = () => {
        if(code.length === 6) {
            setLoading(true);
            secondLoginAdmin(code)
                .then((res) => {
                    if(res?.status === 200) {
                        const token = res?.data?.token;

                        if(token) {
                            const cookies = new Cookies();
                            cookies.set('access_token', token, { path: '/' });
                            window.location = '/panel';
                        }
                        else {
                            setError('Niepoprawny kod');
                            setLoading(false);
                        }
                    }
                    else {
                        setError('Niepoprawny kod');
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setError('Niepoprawny kod');
                });
        }
        else {
            setError('Niepoprawny kod');
        }
    }

    return <>
        <Helmet>
            <title>Anna Vinbotti - panel administracyjny</title>
        </Helmet>
        <div className="container container--adminLogin">
            {!secondAuth ? <div className="admin__login">
                <img className="admin__login__logo" src={logo} alt="anna-vinbotti" />
                <h1 className="admin__login__header">
                    Panel administratora
                </h1>
                <label>
                    <input className="input"
                           value={login}
                           onChange={(e) => { setLogin(e.target.value); }}
                           placeholder="Login" />
                </label>
                <label>
                    <input className="input"
                           value={password}
                           type="password"
                           onChange={(e) => { setPassword(e.target.value); }}
                           placeholder="Hasło" />
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--adminLogin" onClick={() => { handleAdminLogin(); }}>
                    Zaloguj się
                </button> : <div className="center">
                    <Loader />
                </div>}
            </div> : <div className="admin__login admin__login--second">
                <img className="admin__login__logo" src={logo} alt="anna-vinbotti" />
                <h1 className="admin__login__header">
                    Panel administratora
                </h1>
                <h3 className="admin__login__subheader">
                    Wpisz kod do autoryzacji dwuetapowej.
                </h3>
                <label>
                    <input className="input"
                           value={code}
                           onChange={(e) => { setCode(e.target.value); }}
                           placeholder="Kod" />
                </label>

                {error ? <span className="info info--error">
                    {error}
                </span> : ''}

                {!loading ? <button className="btn btn--adminLogin" onClick={() => { handleAdminAuth(); }}>
                    Zaloguj się
                </button> : <div className="center">
                    <Loader />
                </div>}
            </div>}
        </div>
    </>
};

export default AdminLogin;
