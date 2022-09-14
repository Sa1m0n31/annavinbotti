import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getFirstTypeFilledForm, getForm, getWorkingForm, logout, sendForm, sendWorkingForm} from "../../helpers/user";
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import imageIcon from "../../static/img/image-gallery.svg";
import {getTypeById} from "../../helpers/products";
import ConfirmForm from "../../components/shop/ConfirmForm";
import LoadingPage from "../../components/shop/LoadingPage";
import {isInteger, scrollToTop} from "../../helpers/others";
import checkIcon from '../../static/img/check.svg'
import settings from "../../static/settings";
import Loader from "../../components/shop/Loader";

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
    const [workingForm, setWorkingForm] = useState(false);
    const [formRender, setFormRender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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

            getWorkingForm(order, type)
                .then((res) => {
                    if(res?.data?.result?.length) {
                        const form = res.data.result[0].form_data;
                        console.log(JSON.parse(form));
                        setOldForm(JSON.parse(form));

                        getForm(type, 1)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setForm(JSON.parse(res?.data?.result[0]?.[language === 'pl' ? 'form_pl' : 'form_en']));
                                }
                            });
                    }
                    else {
                        getFilledForm();
                    }
                })
                .catch(() => {
                    getFilledForm();
                });

            const getFilledForm = () => {
                getFirstTypeFilledForm(order, type)
                    .then((res) => {
                        if(res?.data?.result?.length) {
                            setOldForm(res?.data?.result[0].form_data);
                        }
                        getForm(type, 1)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setForm(JSON.parse(res?.data?.result[0]?.[language === 'pl' ? 'form_pl' : 'form_en']));
                                }
                            });
                    });
            }
        }
        else {
            window.location = '/';
        }
    }, [language]);

    useEffect(() => {
        if(form && typeId) {
            setRender(true);
            setRequiredInputs(form?.sections?.reduce((prev, curr) => {
                return prev + curr?.fields?.filter((item) => {
                    return item?.type !== 2;
                })?.length;
            }, 0));
            setRequiredImages(form?.sections?.reduce((prev, curr) => {
                return prev + curr?.fields?.filter((item) => {
                    return item?.type !== 1;
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

    useEffect(() => {
        if(oldForm && formData && formRender) {
            const inputsArray = Array.from(document.querySelectorAll('.input'));
            const imagesArray = Array.from(document.querySelectorAll('.formPage__imageInput'));

            inputsArray.forEach((item) => {
               const legIndex = parseInt(item.name.slice(-1));
               const form = legIndex === 0 ? oldForm.right : oldForm.left;
               const officialName = item.name.split('-leg')[0]?.replace('-number', '');

               const val = form.find((item) => {
                   return item.name === officialName && item.type === 'txt';
               }).value;

               item.value = val;

               setInputs(prevState => ({...prevState, [item.name]: val}))
            });

            imagesArray.forEach((item) => {
                const legIndex = parseInt(item.name.slice(-1));
                const form = legIndex === 0 ? oldForm.right : oldForm.left;
                const officialName = item.name.split('-leg')[0]?.replace('-image', '');

                const val = form.find((item) => {
                    return item.name === officialName && item.type === 'img';
                }).value;

                setImages(prevState => ({...prevState, [item.name]: val ? {
                    file: null,
                    fileUrl: `${settings.API_URL}/image?url=/media/filled-forms/${val}`
                } : null}));
            });
        }
    }, [oldForm, formData, formRender]);

    const handleInputUpdate = (e, fieldId) => {
        e.preventDefault();
        const content = e.target.value;
        let newInputs = { ...inputs };

        if(content.length) {
            if(parseFloat(content) < 1000) {
                const lastChar = content[content.length-1];

                if(isInteger(lastChar) || lastChar === '.' || lastChar === ',') {
                    if(lastChar === '.') {
                        if(content.length > 1) {
                            if(content.slice(0, -1).split('').findIndex((item) => (item === '.')) === -1) {
                                newInputs[fieldId] = content;
                            }
                            else {
                                newInputs[fieldId] = content.slice(0, -1);
                            }
                        }
                        else {
                            newInputs[fieldId] = '';
                        }
                    }
                    else if(lastChar === ',') {
                        if(content.length > 1) {
                            if(content.split('').findIndex((item) => (item === '.')) === -1) {
                                newInputs[fieldId] = content.slice(0, -1) + '.';
                            }
                            else {
                                newInputs[fieldId] = content.slice(0, -1);
                            }
                        }
                        else {
                            newInputs[fieldId] = '';
                        }
                    }
                    else {
                        if(content.split('').findIndex((item) => (item === '.')) !== -1) {
                            const decimalPart = content.split('.')[content.split('.').length-1];
                            if(decimalPart.length <= 2) {
                                newInputs[fieldId] = content;
                            }
                            else {
                                newInputs[fieldId] = content.slice(0, -1);
                            }
                        }
                        else {
                            if(content.length < 3) {
                                newInputs[fieldId] = content;
                            }
                            else {
                                newInputs[fieldId] = content.slice(0, -1);
                            }
                        }
                    }
                }
                else {
                    newInputs[fieldId] = content.slice(0, -1);
                }
            }
            else {
                newInputs[fieldId] = content.slice(0, -1);
            }
        }
        else {
            newInputs[fieldId] = content;
        }

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
        setWorkingForm(false);

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
                        else if(item.type === 2) {
                            return {
                                type: 2,
                                [item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]: images[item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]
                            }
                        }
                        else {
                            return {
                                type: 3,
                                [item.caption + '-number-leg' + (index < form.sections.length / 2 ? 0 : 1)]: inputs[item.caption + '-number-leg' + (index < form.sections.length / 2 ? 0 : 1)],
                                [item.caption + '-image-leg' + (index < form.sections.length / 2 ? 0 : 1)]: images[item.caption + '-image-leg' + (index < form.sections.length / 2 ? 0 : 1)]
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
            if(!workingForm) {
                scrollToTop();
                setValidationSucceed(true);
            }
        }
    }, [formData]);

    useEffect(() => {
        if(!validationSucceed) {
            scrollToTop();
        }
    }, [validationSucceed]);

    const prepareWorkingForm = () => {
        setLoading(true);

        const gallery = formData?.map((item) => {
            return item?.filter((item) => {
                return item.type !== 1;
            });
        })
            ?.flat()
            ?.map((item) => {
                if(item.type === 2) {
                    return {
                        [Object.entries(item)[1][0]]: Object.entries(item)[1][1]?.fileUrl
                    }
                }
                else {
                    return {
                        [Object.entries(item)[2][0]]: Object.entries(item)[2][1]?.fileUrl
                    }
                }
            });

        let formDataObject = new FormData();
        for(let i=0; i<gallery.length; i++) {
            const item = Object.entries(gallery[i])[0][1];
            const itemName = Object.entries(gallery[i])[0][0];

            if(item) {
                if(item.split(':')[0] === 'blob') {
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', item, true);
                    xhr.responseType = 'blob';
                    xhr.onload = async function(e) {
                        if(this.status == 200) {
                            let myBlob = this.response;
                            new Promise((resolve, reject) => {
                                formDataObject.append('images', new File([myBlob], itemName));
                                resolve();
                            })
                                .then(() => {
                                    if(i === gallery.length-1) {
                                        setTimeout(() => {
                                            handleWorkingFormSubmit(formDataObject);
                                        }, 500);
                                    }
                                });
                        }
                        else {
                            setTimeout(() => {
                                handleWorkingFormSubmit(formDataObject);
                            }, 500);
                        }
                    };
                    xhr.send();
                }
                else {
                    if(i === gallery.length-1) {
                        setTimeout(() => {
                            handleWorkingFormSubmit(formDataObject);
                        }, 500);
                    }
                }
            }
            else {
                if(i === gallery.length-1) {
                    setTimeout(() => {
                        handleWorkingFormSubmit(formDataObject);
                    }, 500);
                }
            }
        }
    }

    useEffect(() => {
        if(formData && workingForm) {
            prepareWorkingForm();
        }
    }, [formData, workingForm]);

    useEffect(() => {
        if(success) {
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
    }, [success]);

    const handleWorkingFormSubmit = (formDataObject) => {
        sendWorkingForm(formDataObject, orderId, typeId, formData)
            .then((res) => {
                if(res?.status === 201) {
                    setSuccess(true);
                    setError('');
                }
                else {
                    setError('Coś poszło nie tak... Prosimy spróbować później');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Coś poszło nie tak... Prosimy spróbować później');
                setLoading(false);
            });
    }

    const saveWorkingForm = () => {
        setWorkingForm(true);

        setFormData(form?.sections?.map((item, index) => {
            return item?.fields?.map((item) => {
                if(item.type === 1) {
                    const inputVal = inputs[item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)];
                    return {
                        type: 1,
                        [item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]: inputVal ? inputVal : ''
                    }
                }
                else if(item.type === 2) {
                    const inputVal = images[item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)];
                    return {
                        type: 2,
                        [item.caption + '-leg' + (index < form.sections.length / 2 ? 0 : 1)]: inputVal ? inputVal : ''
                    }
                }
                else {
                    const inputVal = inputs[item.caption + '-number-leg' + (index < form.sections.length / 2 ? 0 : 1)];
                    const imageVal = images[item.caption + '-image-leg' + (index < form.sections.length / 2 ? 0 : 1)];
                    return {
                        type: 3,
                        [item.caption + '-number-leg' + (index < form.sections.length / 2 ? 0 : 1)]: inputVal ? inputVal : '',
                        [item.caption + '-image-leg' + (index < form.sections.length / 2 ? 0 : 1)]: imageVal ? imageVal : ''
                    }
                }
            });
        }));
    }

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

             <main className="formPage formPage--1">
                <h1 className="pageHeader">
                    {!validationSucceed ? form.header : 'Twoje wymiary w centymetrach'}
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
                    {form?.sections?.map((item, sectionIndex, array) => {
                        if(sectionIndex === array.length - 1) {
                            setTimeout(() => {
                                setFormRender(true);
                            }, 500);
                        }
                        return <section key={sectionIndex}
                                        className={item.border ? "formSection formSection--type1" : "formSection formSection--type1 formSection--noBorder"}>
                            {item.header ? <h2 className="formSection__header">
                                {item.header}
                            </h2> : ''}
                            {item.subheader ? <h3 className="formSection__subheader">
                                {item.subheader}
                            </h3> : ''}

                            <div className="formSection__content">
                                {item.fields?.map((item, index) => {

                                    if(item.type === 1) {
                                        return <label className="formPage__label formPage__label--type1" key={index}>
                                            <span className="formPage__label__caption">
                                                {item.caption}
                                            </span>
                                            <input className="input"
                                                   name={item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)}
                                                   value={inputs[item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)]}
                                                   onChange={(e) => { handleInputUpdate(e, item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }}
                                                   placeholder={item.placeholder} />
                                        </label>
                                    }
                                    else if(item.type === 2) {
                                        return <div className="formPage__label">
                                            <span className="formPage__label__caption">
                                                {item.caption}
                                            </span>
                                            {!images[item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)] ? <span key={index} className="formPage__imageWrapper">
                                            <input type="file"
                                                   className="formPage__imageInput"
                                                   multiple={false}
                                                   name={item.caption + '-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)}
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
                                    else {
                                        return <div className="formPage__label flex" key={index}>
                                            <span className="formPage__label__caption">
                                                {item.caption}
                                            </span>
                                            <label className="formPage__label formPage__label--half">
                                                <input className="input"
                                                       name={item.caption + '-number-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)}
                                                       value={inputs[item.caption + '-number-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)]}
                                                       onChange={(e) => { handleInputUpdate(e, item.caption + '-number-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }}
                                                       placeholder={item.placeholder} />
                                            </label>

                                            {!images[item.caption + '-image-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)] ?
                                                <span key={index} className="formPage__imageWrapper">
                                            <input type="file"
                                                   className="formPage__imageInput"
                                                   multiple={false}
                                                   name={item.caption + '-image-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)}
                                                   onChange={(e) => {
                                                       handleImageUpload(e, item.caption + '-image-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }} />
                                           <div className="editor__videoWrapper__placeholderContent">
                                                <p className="editor__videoWrapper__placeholderContent__text">
                                                    Dodaj zdjęcie
                                                </p>
                                                <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                                        </div>
                                    </span> :  <span key={index} className="formPage__imageWrapper">
                                                    <button className="formPage__deleteBtn"
                                                            onClick={(e) => { e.stopPropagation();
                                                                e.preventDefault();
                                                                deleteImg(item.caption + '-image-leg' + (sectionIndex < form.sections.length / 2 ? 0 : 1)); }}>
                                                        &times;
                                                    </button>
                                                    <div className="editor__videoWrapper__placeholderContent editor__videoWrapper__placeholderContent--check">
                                                        <p className="editor__videoWrapper__placeholderContent__text">
                                                            Zdjęcie dodane
                                                        </p>
                                                        <img className="editor__videoWrapper__icon editor__videoWrapper__icon--check" src={checkIcon} alt="video" />
                                                    </div>
                                                </span>}
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

                    <div className="form__address">
                        <p className="contact__top__section__data">
                            Sklep Anna Vinbotti
                        </p>
                        <p className="contact__top__section__data">
                            Ul. Tomasza Zana 43 / lok. 2.1
                        </p>
                        <p className="contact__top__section__data">
                            20 – 601 Lublin
                        </p>
                    </div>

                    {error ? <span className="info info--error">
                        {error}
                    </span> : ''}

                    {!loading && !success ? <button className="btn btn--submit btn--saveForm"
                                                    onClick={() => { saveWorkingForm(); }}>
                        Dokończę później
                    </button> : (loading ? <div className="center marginBottom">
                        <Loader />
                    </div> : <span className="info info--success">
                        Zmiany zostały zapisane.
                    </span>)}

                    <button className="btn btn--submit"
                            onClick={() => { validateForm(); }}>
                        Prześlij
                    </button>
                </> : <ConfirmForm data={formData}
                                   formType={1}
                                   type={typeId}
                                   backToEdition={() => { setValidationSucceed(false); }}
                                   orderId={orderId} />}
            </main>

        </main>

        <Footer />
    </div> : <LoadingPage />
};

export default FormType1;
