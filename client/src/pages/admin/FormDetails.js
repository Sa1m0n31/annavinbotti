import React, {useEffect, useState} from 'react';
import {getFormDetails} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import AdminOrderInfo from "../../components/admin/AdminOrderInfo";
import AdminOrderCart from "../../components/admin/AdminOrderCart";
import settings from "../../static/settings";

const FormDetails = () => {
    const [formLeft, setFormLeft] = useState([]);
    const [formRight, setFormRight] = useState([]);
    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if(params) {
            const form = params.get('form');
            const sell = params.get('sell');

            if(form && sell) {
                getFormDetails(form, sell)
                    .then((res) => {
                        const r = res?.data?.result;
                        if(r) {
                            setOrder(r[0].order_id);
                            setProduct(r[0].product);
                            const result = r[0].form_data;
                            setFormLeft(result.left);
                            setFormRight(result.right);
                        }
                    });
            }
        }
    }, []);

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Szczegóły formularza
                </h2>

                <h3 className="admin__main__subheader">
                    <span>
                        Zamówienie:
                    </span>
                    #{order}
                </h3>
                <h3 className="admin__main__subheader">
                    <span>
                        Produkt:
                    </span>
                    {product}
                </h3>

                <div className="admin__form">
                    <div className="admin__form__section">
                        <h4 className="admin__order__right__header">
                            But lewy
                        </h4>
                        {formLeft?.map((item, index) => {
                            const imageSrc = `${settings.API_URL}/image?url=/media/forms/${item.value}`;

                            return <div className="admin__form__field">
                            <span>
                                {item.name}
                                {item.type === 'img' ? <a className="admin__form__field__openInNewTabBtn" href={imageSrc} target="_blank">
                                    (Otwórz zdjęcie w nowej karcie)
                                </a> : ''}
                            </span>
                                {item.type === 'txt' ? <p className="admin__form__field__value">
                                    {item.value}
                                </p> : <figure className="admin__form__field__imageWrapper">
                                    <img className="img" src={imageSrc} alt={item.name} />
                                </figure>}
                            </div>
                        })}
                    </div>
                    <div className="admin__form__section">
                        <h4 className="admin__order__right__header">
                            But prawy
                        </h4>
                        {formRight?.map((item, index) => {
                            const imageSrc = `${settings.API_URL}/image?url=/media/forms/${item.value}`;

                            return <div className="admin__form__field">
                            <span>
                                {item.name}
                                {item.type === 'img' ? <a className="admin__form__field__openInNewTabBtn" href={imageSrc} target="_blank">
                                    (Otwórz zdjęcie w nowej karcie)
                                </a> : ''}
                            </span>
                                {item.type === 'txt' ? <p className="admin__form__field__value">
                                    {item.value}
                                </p> : <figure className="admin__form__field__imageWrapper">
                                    <img className="img" src={imageSrc} alt={item.name} />
                                </figure>}
                            </div>
                        })}
                    </div>
                </div>
            </main>
        </div>
    </div>
};

export default FormDetails;
