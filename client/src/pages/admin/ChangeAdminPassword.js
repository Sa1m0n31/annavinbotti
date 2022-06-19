import React, {useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {changeAdminPassword} from "../../helpers/admin";

const ChangeAdminPassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [status, setStatus] = useState(0);

    const changePassword = () => {
        if(password && repeatPassword) {
            if(password !== repeatPassword) {
                setStatus(-4);
            }
            else {
                changeAdminPassword(oldPassword, password, 'anna') // TODO: add admin id from passport.js
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(1);
                        }
                        else if(res?.status === 400) {
                            setStatus(-3);
                        }
                        else {
                            setStatus(-1);
                        }
                    })
                    .catch((err) => {
                        if(err?.response?.status === 400) setStatus(-3);
                        else setStatus(-1);
                    });
            }
        }
        else {
            setStatus(-2);
        }
    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={-1} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Zmień hasło
                </h2>
                {status ? <span className="admin__status">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -4 ? <span className="admin__status__inner admin__status--error">
                            Podane hasła nie są identyczne
                        </span> : (status === -3 ? <span className="admin__status__inner admin__status--error">
                            Niepoprawne stare hasło
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            Hasło zostało zmienione
                        </span>))}
                </span> : ""}

                <label>
                    Stare hasło
                    <input className="input"
                           placeholder="Stare hasło"
                           type="password"
                           value={oldPassword}
                           onChange={(e) => { setOldPassword(e.target.value); }} />
                </label>
                <label>
                    Nowe hasło
                    <input className="input"
                           placeholder="Nowe hasło"
                           type="password"
                           value={password}
                           onChange={(e) => { setPassword(e.target.value); }} />
                </label>
                <label>
                    Powtórz nowe hasło
                    <input className="input"
                           placeholder="Powtórz nowe hasło"
                           type="password"
                           value={repeatPassword}
                           onChange={(e) => { setRepeatPassword(e.target.value); }} />
                </label>

                <button className="btn btn--admin btn--admin--type" onClick={() => { changePassword(); }}>
                    Zaktualizuj hasło
                </button>
            </main>
        </div>
    </div>
};

export default ChangeAdminPassword;
