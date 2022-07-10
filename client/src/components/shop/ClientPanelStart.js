import React, {useEffect, useState} from 'react';
import {getUserInfo} from "../../helpers/user";
import Loader from "./Loader";

const ClientPanelStart = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        getUserInfo()
            .then((res) => {
                if(res?.status === 200) {
                    setName(res?.data?.result[0]?.first_name);
                }
            });
    }, []);

    return <div className="panel__main panel__main--start">
        {name ? <>
            <h2 className="panel__main--start__header">
                Cześć, <span className="bold">{name}</span>!
            </h2>
            <p className="panel__main--start__text">
                Witaj na Twoim koncie, możesz tutaj. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </> : <div className="center marginTop">
            <Loader />
        </div>}
    </div>
};

export default ClientPanelStart;
