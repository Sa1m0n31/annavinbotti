import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import AdminMenu from "../../components/admin/AdminMenu";
import TypeListItem from "../../components/admin/TypeListItem";
import {getAllWaitlists} from "../../helpers/products";
import WaitlistListItem from "../../components/admin/WaitlistListItem";

const Waitlist = () => {
    const [waitlists, setWaitlists] = useState([]);

    useEffect(() => {
        getAllWaitlists()
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    setWaitlists(result);
                }
            });
    }, []);

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Waitlisty modeli
                </h2>
                {waitlists?.map((item, index) => {
                    return <WaitlistListItem index={index}
                                             id={item.id}
                                             name={item.product_name}
                                             count={item.waitlist_size} />
                })}
            </main>
        </div>
    </div>
};

export default Waitlist;
