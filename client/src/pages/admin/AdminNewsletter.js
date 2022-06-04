import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {getAllNewsletterSubscribers} from "../../helpers/newsletter";

const AdminNewsletter = () => {
    const [emails, setEmails] = useState([]);

    useEffect(() => {
        getAllNewsletterSubscribers()
            .then((res) => {
                setEmails(res?.data?.result);
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
                    return <p className="newsletterList__item">
                        {item.email}
                    </p>
                })}
            </main>
        </div>
    </div>
};

export default AdminNewsletter;
