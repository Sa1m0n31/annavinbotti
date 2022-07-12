import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getForm} from "../../helpers/user";
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import imageIcon from "../../static/img/image-gallery.svg";
import {getTypeById} from "../../helpers/products";

const FormType1 = () => {
    const { language } = useContext(ContentContext);

    const [orderId, setOrderId] = useState('');
    const [type, setType] = useState('');
    const [form, setForm] = useState({});
    const [inputs, setInputs] = useState({});
    const [images, setImages] = useState({});
    const [requiredInputs, setRequiredInputs] = useState(null);
    const [requiredImages, setRequiredImages] = useState(null);
    const [error, setError] = useState("");
    const [validationSucceed, setValidationSucceed] = useState(false);
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const order = params.get('zamowienie');
        const type = params.get('typ');

        if(order && type) {
            setOrderId(order);

            getTypeById(type)
                .then((res) => {
                    if(res?.status === 200) {
                        setType(res?.data?.result[0]?.[language === 'pl' ? 'name_pl' : 'name_en']);
                    }
                });

            getForm(type, 1)
                .then((res) => {
                    if(res?.status === 200) {
                        setForm(JSON.parse(res?.data?.result[0]?.[language === 'pl' ? 'form_pl' : 'form_en']));
                    }
                });
        }
        else {
            window.location = '/';
        }
    }, [language]);

    useEffect(() => {
        if(form) {
            setRequiredInputs(form?.sections?.reduce((prev, curr) => {
                return prev + curr?.fields?.filter((item) => {
                    return item?.type === 1;
                })?.length;
            }, 0));
            setRequiredImages(form?.sections?.reduce((prev, curr) => {
                return prev + curr?.fields?.filter((item) => {
                    return item?.type === 2;
                })?.length;
            }, 0));
        }
    }, [form]);

    const deleteImg = (caption) => {
        let newImages = { ...images };
        newImages[caption] = null;
        setImages(newImages);
    }

    const handleImageUpload = (e, fieldId) => {
        const file = e.target.files[0];
        const fileUrl = window.URL.createObjectURL(file);
        let newImages = { ...images };
        newImages[fieldId] = {
            file: file,
            fileUrl: fileUrl
        }
        setImages(newImages);
    }

    const handleInputUpdate = (e, fieldId) => {
        const content = e.target.value;
        let newInputs = { ...inputs };
        newInputs[fieldId] = content;
        setInputs(newInputs);
    }

    const validateFields = (obj, required) => {
        const entries = Object.entries(obj);
        if(entries.length !== required) {
            return false;
        }
        else {
            return entries.findIndex((item) => {
                return !item[1];
            }) !== -1;
        }
    }

    const validateForm = () => {
        if(requiredImages !== null && requiredInputs !== null) {
            if(validateFields(inputs, requiredInputs) && validateFields(images, requiredImages)) {
                setFormData(form?.sections?.map((item) => {
                    return item?.fields?.map((item) => {
                        if(item.type === 1) {
                            return {
                                type: 1,
                                [item.caption]: inputs[item.caption]
                            }
                        }
                        else {
                            return {
                                type: 2,
                                [item.caption]: images[item.caption]
                            }
                        }
                    });
                }));
            }
            else {
                setError(language === 'pl' ? 'Uzupełnij wszystkie pola' : 'Fill all fields');
            }
        }
    }

    useEffect(() => {
        if(formData?.length) {
            setValidationSucceed(true);
        }
    }, [formData]);

    return <div className="container">
        <PageHeader />

        <main className="formPage w">
            <h1 className="pageHeader">
                {form.header}
            </h1>
            <div className="formPage__info">
                <p className="formPage__info__p">
                    <span>
                        Zamówienie:
                    </span>
                        <span>
                        #{orderId}
                    </span>
                </p>
                <p className="formPage__info__p">
                    <span>
                        Typ obuwia:
                    </span>
                    <span>
                        {type}
                    </span>
                </p>
            </div>

            {form?.sections?.map((item, index) => {
                return <section key={index}
                                className={item.border ? "formSection" : "formSection formSection--noBorder"}>
                    {item.header ? <h2 className="formSection__header">
                        {item.header}
                    </h2> : ''}
                    {item.subheader ? <h3 className="formSection__subheader">
                        {item.subheader}
                    </h3> : ''}

                    <div className="formSection__content">
                        {item.fields?.map((item, index) => {
                            if(item.type === 1) {
                                return <label className="formPage__label" key={index}>
                                    {item.caption}
                                    <input className="input"
                                           name={item.caption}
                                           onChange={(e) => { handleInputUpdate(e, item.caption); }}
                                           placeholder={item.placeholder} />
                                </label>
                            }
                            else if(item.type === 2) {
                                return <div className="formPage__label">
                                    {item.caption}
                                    {!images[item.caption] ? <span key={index} className="formPage__imageWrapper">
                                <input type="file" className="formPage__imageInput" multiple={false}
                                       onChange={(e) => { handleImageUpload(e, item.caption); }} />
                               <div className="editor__videoWrapper__placeholderContent">
                                    <p className="editor__videoWrapper__placeholderContent__text">
                                        Kliknij tutaj lub upuść plik aby dodać zdjęcie
                                    </p>
                                    <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                            </div>
                        </span> : <div className="formPage__imgWrapper">
                                        <button className="formPage__deleteBtn"
                                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg(item.caption); }}>
                                            &times;
                                        </button>
                                        <img className="img" src={images[item.caption]?.fileUrl} alt={item.caption} />
                                    </div>}
                                </div>
                            }
                        })}
                    </div>
                    {item.img ? <figure className="formSection__img">
                        {item.imgCaption ? <figcaption>
                            {item.imgCaption}
                        </figcaption> : ''}
                        <img className="img" src={`${constans.IMAGE_URL}/media/forms/${item.img}`} alt={item.imgCaption} />
                    </figure> : ''}
                </section>
            })}

            <p className="formEnd">
                {form.end}
            </p>

            {error ? <span className="info info--error">
                {error}
            </span> : ''}

            <button className="btn btn--submit" onClick={() => { validateForm(); }}>
                Prześlij wymiary
            </button>
        </main>

        <Footer />
    </div>
};

export default FormType1;
