import React, {useEffect, useState} from 'react';
import {getProductDetails, getWaitlistByProductId} from "../../helpers/products";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";

const WaitlistDetails = () => {
    const [waitlist, setWaitlist] = useState([]);
    const [product, setProduct] = useState("");

    useEffect(() => {
        const id = new URLSearchParams(window.location.search)?.get('id');

        if(id) {
            getProductDetails(id)
                .then((res) => {
                   const result = res?.data?.result;
                   if(result) {
                       setProduct(result[0]?.name_pl);
                   }
                });

            getWaitlistByProductId(id)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result) {
                        setWaitlist(result);
                    }
                });
        }
        else {
            window.location = '/panel';
        }
    }, []);

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Waitlista dla produktu {product}
                </h2>
                {waitlist?.map((item, index) => {
                    return <p className="newsletterList__item">
                        {item.email}
                    </p>
                })}
            </main>
        </div>
    </div>
};

export default WaitlistDetails;
