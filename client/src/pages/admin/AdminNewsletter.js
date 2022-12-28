import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {getAllNewsletterSubscribers} from "../../helpers/newsletter";
import {getDate, getTime} from "../../helpers/others";

const AdminNewsletter = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        getAllNewsletterSubscribers()
            .then((res) => {
                setEmails(res?.data?.result?.sort((a, b) => {
                    const dateA = getDate(a?.register_date)?.split('.');
                    const dateB = getDate(b?.register_date)?.split('.');

                    return new Date(`${dateA[2]}-${dateA[1]}-${dateA[0]}`) < new Date(`${dateB[2]}-${dateB[1]}-${dateB[0]}`) ? 1 : -1;
                }));
            });
    }, []);

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={7} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Adresy mailowe zapisane do newslettera ({emails?.length})
                </h2>
                {emails?.map((item, index) => {
                    return <div className="newsletterList__item flex" key={index}>
                        <p>
                            {item.email}
                        </p>
                        <p>
                            {getDate(item.register_date)}, {getTime(item.register_date)}
                        </p>
                    </div>
                })}
            </main>
        </div>
    </div>
};

export default AdminNewsletter;
