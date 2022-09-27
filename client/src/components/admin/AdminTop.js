import React, {useEffect, useState} from 'react'
import logo from '../../static/img/logo.svg'
import profileImg from '../../static/img/profile-picture.png'
import {getAdminData} from '../../helpers/admin'
import padlock from '../../static/img/padlock.svg'
import logoutIcon from '../../static/img/logout.svg'
import {logoutAdmin, logoutUser} from '../../helpers/auth'

const AdminTop = () => {
    const [username, setUsername] = useState("");
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    useEffect(() => {
        getAdminData()
            .then((res) => {
                setUsername(res?.data?.result?.login);
            });
    }, []);

    return <header className="adminTop">
        <a className="adminTop__logoWrapper" href="/panel">
            <img className="btn__img" src={logo} alt="draft4u" />
        </a>

        <section className="adminTop__right">
            <h4 className="adminTop__header">
                <span className="adminTop__header__value">
                    {username}
                </span>
            </h4>
            <button className="siteHeader__player__btn siteHeader__player__btn--profile d-desktop"
                    onClick={() => { setProfileMenuVisible(!profileMenuVisible); }}
            >
                <img className="siteHeader__player__btn--profile__img" src={profileImg} alt="profile" />
            </button>

            {profileMenuVisible ? <menu className="profileMenu profileMenu--club profileMenu--admin">
                <ul className="profileMenu__list">
                    <li className="profileMenu__list__item">
                        <a className="profileMenu__list__link" href="/zmien-haslo-administratora">
                            <img className="profileMenu__list__img" src={padlock} alt="zmien-haslo" />
                            Zmiana hasła
                        </a>
                        <button className="profileMenu__list__link" onClick={() => { logoutAdmin(); }}>
                            <img className="profileMenu__list__img" src={logoutIcon} alt="wyloguj-sie" />
                            Wyloguj się
                        </button>
                    </li>
                </ul>
            </menu> : ""}

        </section>
    </header>
}

export default AdminTop;
