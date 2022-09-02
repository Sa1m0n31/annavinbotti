import React, {useEffect, useState} from 'react';
import {getFormDetails} from "../../helpers/orders";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import backArrow from '../../static/img/arrow-back.svg'
import settings from "../../static/settings";
import {downloadData} from "../../helpers/others";

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

    const downloadZip = () => {
        const left = formLeft
            .filter((item) => (item.type === 'img'))
            .map((item) => {
                return {
                    url: `${settings.API_URL}/image?url=/media/filled-forms/${item.value}`,
                    name: `Stopa lewa - ${item.name}`
                }
            });

        const right = formRight
            .filter((item) => (item.type === 'img'))
            .map((item) => {
                return {
                    url: `${settings.API_URL}/image?url=/media/filled-forms/${item.value}`,
                    name: `Stopa prawa - ${item.name}`
                }
            });

        const formContentLeft = formLeft
            .filter((item) => (item.type === 'txt'))
            .map((item) => {
                return `Stopa lewa - ${item.name}: ${item.value}`;
            });

        const formContentRight = formRight
            .filter((item) => (item.type === 'txt'))
            .map((item) => {
                return `Stopa prawa - ${item.name}: ${item.value}`;
            });

        downloadData(left?.concat(right),
            formContentLeft?.concat(formContentRight),
            order);
    }

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={5} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Szczegóły formularza

                    <a className="admin__main__backBtn" href={`/szczegoly-zamowienia?id=${order}`}>
                        <img className="img" src={backArrow} alt="powrót" />
                        Powrót do zamówienia
                    </a>
                </h2>

                <button className="btn btn--downloadZip" onClick={() => { downloadZip(); }}>
                    Pobierz formularz
                </button>

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
                            Stopa lewa
                        </h4>
                        {formLeft?.map((item, index) => {
                            const imageSrc = `${settings.API_URL}/image?url=/media/filled-forms/${item.value}`;

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
                            Stopa prawa
                        </h4>
                        {formRight?.map((item, index) => {
                            const imageSrc = `${settings.API_URL}/image?url=/media/filled-forms/${item.value}`;

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
