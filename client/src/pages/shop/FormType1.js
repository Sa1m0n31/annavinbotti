import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getFirstTypeFilledForm, getForm, logout} from "../../helpers/user";
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import imageIcon from "../../static/img/image-gallery.svg";
import {getTypeById} from "../../helpers/products";
import ConfirmForm from "../../components/shop/ConfirmForm";
import OldFormData from "../../components/shop/OldFormData";
import LoadingPage from "../../components/shop/LoadingPage";

const FormType1 = () => {
    const { language } = useContext(ContentContext);

    const [render, setRender] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [typeId, setTypeId] = useState(0);
    const [type, setType] = useState('');
    const [form, setForm] = useState({});
    const [inputs, setInputs] = useState({});
    const [images, setImages] = useState({});
    const [requiredInputs, setRequiredInputs] = useState(null);
    const [requiredImages, setRequiredImages] = useState(null);
    const [error, setError] = useState("");
    const [validationSucceed, setValidationSucceed] = useState(false);
    const [formData, setFormData] = useState([]);
    const [oldForm, setOldForm] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const order = params.get('zamowienie');
        const type = params.get('typ');

        if(order && type) {
            setOrderId(order);
            setTypeId(parseInt(type));

            getTypeById(type)
                .then((res) => {
                    if(res?.status === 200) {
                        setType(res?.data?.result[0]?.[language === 'pl' ? 'name_pl' : 'name_en']);
                    }
                });

            getFirstTypeFilledForm(order, type)
                .then((res) => {
                   if(res?.data?.result?.length) {
                       setOldForm(res?.data?.result[0].form_data);
                   }
                   else {
                       getForm(type, 1)
                           .then((res) => {
                               if(res?.status === 200) {
                                   setForm(JSON.parse(res?.data?.result[0]?.[language === 'pl' ? 'form_pl' : 'form_en']));
                               }
                           });
                   }
                });
        }
        else {
            window.location = '/';
        }
    }, [language]);

    useEffect(() => {
        if(form) {
            setRender(true);
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
            }) === -1;
        }
    }

    const validateForm = () => {
        if(requiredImages !== null && requiredInputs !== null) {
            if(validateFields(inputs, requiredInputs) && validateFields(images, requiredImages)) {
                setFormData(form?.sections?.map((item, index) => {
                    return item?.fields?.map((item) => {
                        if(item.type === 1) {
                            return {
                                type: 1,
                                [item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]: inputs[item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]
                            }
                        }
                        else {
                            return {
                                type: 2,
                                [item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]: images[item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setValidationSucceed(true);
        }
    }, [formData]);

    return render ? <div className="container">
        <PageHeader />

        <main className="panel w flex">
            <div className="panel__menu">
                <h1 className="panel__header">
                    Konto
                </h1>

                <div className="panel__menu__menu">
                    <button className="panel__menu__item" onClick={() => { window.location = '/panel-klienta?sekcja=twoje-dane'; }}>
                        Twoje dane
                    </button>
                    <button className="panel__menu__item panel__menu__item--selected" onClick={() => { window.location = '/panel-klienta?sekcja=zamowienia'; }}>
                        Zamówienia
                    </button>
                    <button className="panel__menu__item" onClick={() => { logout(); }}>
                        Wyloguj się
                    </button>
                </div>
            </div>

            {oldForm ? <OldFormData data={oldForm} orderId={orderId} type={type} /> : <main className="formPage">
                <h1 className="pageHeader">
                    {!validationSucceed ? form.header : 'Twoje wymiary'}
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

                {!validationSucceed ? <>
                    {form?.sections?.map((item, sectionIndex) => {
                        return <section key={sectionIndex}
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
                                                   onChange={(e) => { handleInputUpdate(e, item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }}
                                                   placeholder={item.placeholder} />
                                        </label>
                                    }
                                    else if(item.type === 2) {
                                        return <div className="formPage__label">
                                            {item.caption}
                                            {!images[item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)] ? <span key={index} className="formPage__imageWrapper">
                                        <input type="file" className="formPage__imageInput" multiple={false}
                                               onChange={(e) => { handleImageUpload(e, item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }} />
                                       <div className="editor__videoWrapper__placeholderContent">
                                            <p className="editor__videoWrapper__placeholderContent__text">
                                                Kliknij tutaj lub upuść plik aby dodać zdjęcie
                                            </p>
                                            <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                                    </div>
                                </span> : <div className="formPage__imgWrapper">
                                                <button className="formPage__deleteBtn"
                                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg(item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }}>
                                                    &times;
                                                </button>
                                                <img className="img" src={images[item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)]?.fileUrl} alt={item.caption} />
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
                        Zapisz
                    </button>
                </> : <ConfirmForm data={formData}
                                   formType={1}
                                   type={typeId}
                                   orderId={orderId} />}
            </main>}

        </main>

        <Footer />
    </div> : <LoadingPage />
};

export default FormType1;
