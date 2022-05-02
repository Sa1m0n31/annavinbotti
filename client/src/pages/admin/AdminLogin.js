import React, {useState} from 'react';
import logo from '../../static/img/logo.svg'

const AdminLogin = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    return <div className="container container--adminLogin">
        <div className="admin__login">
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
            <button className="btn btn--adminLogin">
                Zaloguj się
            </button>
        </div>
    </div>
};

export default AdminLogin;
