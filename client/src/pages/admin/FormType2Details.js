import React, {useEffect, useState} from 'react';
import {getFormDetails} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import AdminOrderInfo from "../../components/admin/AdminOrderInfo";
import AdminOrderCart from "../../components/admin/AdminOrderCart";
import settings from "../../static/settings";
import {getSecondTypeFilledForm} from "../../helpers/user";
import constans from "../../helpers/constants";

const FormType2Details = () => {
    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);

    const [form, setForm] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if(params) {
            const order = params.get('order');
            const model = params.get('model');

            setOrder(order);

            if(order && model) {
                getSecondTypeFilledForm(order, model)
                    .then((res) => {
                        const r = res?.data?.result;
                        if(r) {
                            setProduct(r[0]?.name_pl);
                            setForm(JSON.parse(r[0]?.form_data));
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
                    <div className="admin__form__section--full">
                        {form?.map((item, index) => {
                            const type = item.type;
                            return <div className="formSection formSection--confirm" key={index}>
                                <h2 className="formSection__header">
                                    {item.question}
                                </h2>
                                {item?.answer?.map((item, index) => {
                                    if(type === 'txt') {
                                        return <p className="formSection--confirm__answer" key={index}>
                                            {item}
                                        </p>
                                    }
                                    else {
                                        return <figure className="formSection--confirm__answer--img">
                                            <figcaption>
                                                {Object.entries(item)[0][0]}
                                            </figcaption>
                                            <img className="img" src={`${constans.IMAGE_URL}/media/filled-forms/${Object.entries(item)[0][1]}`} alt={item.question} />
                                        </figure>
                                    }
                                })}
                            </div>
                        })}
                    </div>
                </div>
            </main>
        </div>
    </div>
};

export default FormType2Details;
