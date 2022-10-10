import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getForm, getSecondTypeFilledForm, getUserInfo, logout, sendForm} from "../../helpers/user";
import {ContentContext} from "../../App";
import imageIcon from "../../static/img/image-gallery.svg";
import {getProductDetails, getTypeById, getTypeByProduct} from "../../helpers/products";
import FormSubmitted from "../../components/shop/FormSubmitted";
import Loader from "../../components/shop/Loader";
import OldFormDataType2 from "../../components/shop/OldFormDataType2";
import LoadingPage from "../../components/shop/LoadingPage";
import {isInteger, scrollToTop} from "../../helpers/others";
import checkIcon from "../../static/img/check.svg";
import {isLoggedIn} from "../../helpers/auth";

const FormType2 = () => {
    const { language } = useContext(ContentContext);

    const [render, setRender] = useState(false);
    const [typeId, setTypeId] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [modelId, setModelId] = useState(0);
    const [model, setModel] = useState('');
    const [form, setForm] = useState([]);
    const [images, setImages] = useState({});
    const [requiredInputs, setRequiredInputs] = useState(null);
    const [requiredImages, setRequiredImages] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [validationSucceed, setValidationSucceed] = useState(false);
    const [formData, setFormData] = useState([]);
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [oldForm, setOldForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmForm, setConfirmForm] = useState(false);

    useEffect(() => {
        isLoggedIn()
            .then((res) => {
                if(res?.status === 200) {
                    const params = new URLSearchParams(window.location.search);

                    const order = params.get('zamowienie');
                    const model = params.get('model');

                    if(order && model) {
                        setOrderId(order);
                        setModelId(parseInt(model));

                        getProductDetails(model)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setModel(res?.data?.result[0]?.[language === 'pl' ? 'name_pl' : 'name_en']);
                                }
                            });

                        getTypeByProduct(model)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setTypeId(res?.data?.result[0]?.type);
                                }
                            });
                    }
                    else {
                        window.location = '/';
                    }
                }
                else {
                    window.location = '/moje-konto';
                }
            })
            .catch(() => {
                window.location = '/moje-konto';
            });
    }, [language]);

    useEffect(() => {
        if(error || success || validationError) {
            setLoading(false);
            if(success) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }, [error, success, validationError]);

    useEffect(() => {
        if(typeId && orderId && modelId) {
            getSecondTypeFilledForm(orderId, modelId)
                .then((res) => {
                    if(res?.data?.result?.length) {
                        window.location = '/panel-klienta';
                    }
                    else {
                        getForm(typeId, 2)
                            .then((res) => {
                                if(res?.status === 200) {
                                    setRender(true);
                                    setForm(JSON.parse(res?.data?.result[0]?.[language === 'pl' ? 'form_pl' : 'form_en']));
                                }
                            })
                            .catch(() => {
                                window.location = '/';
                            });
                    }
                })
        }
    }, [typeId, orderId, modelId]);

    useEffect(() => {
        if(form) {
            setSelectedButtons(form?.map((parentItem) => {
                return parentItem.fields.map(() => (parentItem.type === 'images-multiple' ? null : false));
            }));

            setRequiredInputs(form?.reduce((prev, curr) => {
                if(curr.type === 'images-multiple') {
                    return prev;
                }
                else {
                    return prev + 1;
                }
            }, 0));
            setRequiredImages(form?.reduce((prev, curr) => {
                if(curr.type === 'images-multiple') {
                    return prev + curr.fields.length;
                }
                else {
                    return prev;
                }
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

    const validateButtons = (obj) => {
        return obj?.findIndex((item) => {
            return !item.answer?.length;
        }) === -1;
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

    const handleFormSubmit = (formData, formJSON) => {
        getUserInfo()
            .then((res) => {
                const email = res?.data?.result[0]?.email;
                if(email) {
                    sendForm(formData, 2, orderId, modelId, formJSON, email)
                        .then((res) => {
                            if(res?.status === 201) {
                                setSuccess(true);
                            }
                            else {
                                setError(true);
                            }
                        })
                        .catch(() => {
                            setError(true);
                        });
                }
                else {
                    setError(true);
                }
            });
    }

    const prepareForm = (formJSON) => {
        const gallery = Object.entries(images)?.map((item) => {
            return {
                [item[0]]: item[1]?.fileUrl
            }
        });

        let formData = new FormData();
        for(let i=0; i<gallery.length; i++) {
            const item = Object.entries(gallery[i])[0][1];
            const itemName = Object.entries(gallery[i])[0][0];

            let xhr = new XMLHttpRequest();
            xhr.open('GET', item, true);
            xhr.responseType = 'blob';
            xhr.onload = async function(e) {
                if(this.status == 200) {
                    let myBlob = this.response;
                    new Promise((resolve, reject) => {
                        formData.append('images', new File([myBlob], itemName));
                        resolve();
                    })
                        .then(() => {
                            if(i === gallery.length-1) {
                                setTimeout(() => {
                                    handleFormSubmit(formData, formJSON);
                                }, 500);
                            }
                        });
                }
                else {
                    setTimeout(() => {
                        handleFormSubmit(formData, formJSON);
                    }, 500);
                }
            };
            xhr.send();
        }
    }

    useEffect(() => {
        if(confirmForm) {
            scrollToTop();
        }
    }, [confirmForm]);

    const validateForm = () => {
        if(requiredImages !== null && requiredInputs !== null) {
            setLoading(true);
            const formJSON = selectedButtons?.map((item, index) => {
                const formSection = form[index];
                const parentItem = item;

                return {
                    question: formSection.question,
                    answer: formSection.type === 'images-multiple' ? formSection.fields.map((item) => {
                        return {
                            [item]: images[item]
                        };
                    }) : formSection.fields.map((item, index) => {
                        const regex = /\[.+\]/g;
                        const match = item.match(regex);
                        if(match) {
                            return item.replace(match[0], parentItem[index]);
                        }
                        else {
                            return item;
                        }
                    }).filter((item, index) => {
                        return parentItem[index];
                    })
                }
            });

            if(validateFields(images, requiredImages) && validateButtons(formJSON)) {
                if(confirmForm) {
                    prepareForm(formJSON);
                }
                else {
                    setConfirmForm(true);
                    setLoading(false);
                    scrollToTop();
                }
            }
            else {
                setLoading(false);
                setValidationError(true);
            }
        }
    }

    useEffect(() => {
        if(formData?.length) {
            scrollToTop();
            setValidationSucceed(true);
        }
    }, [formData]);

    const renderTextAndInput = (input, question, index) => {
        const regex = /\[.+\]/g;
        const inputText = input.match(regex);
        if(inputText) {
            const inputParams = inputText[0].replace('[', '').replace(']', '').split(' ');
            const inputType = inputParams[0];
            const inputWidth = parseInt(inputParams[1]);
            const inputHeight = parseInt(inputParams[2]);

            return <span>
                <span>
                    {input.split(regex)[0]}
                </span>
                {inputHeight > 80 ? <textarea className="input input--rendered"
                                              onChange={(e) => {
                                                  handleButtonUpdate(question, index, 'input', e.target.value);
                                              }}
                                           style={{
                                               height: inputHeight + 'px'
                                           }} /> :
                    <input className="input input--rendered"
                           onChange={(e) => {
                                handleButtonUpdate(question, index, 'input', e.target.value, inputType);
                           }}
                           value={selectedButtons?.length > question ? !isNaN(selectedButtons[question][index]?.toString()) ? selectedButtons[question][index] : '' : ''}
                           style={{
                               width: inputWidth + 'px',
                               height: inputHeight + 'px'
                           }} />
                }
                <span>
                    {input.split(regex)[1]}
                </span>
            </span>
        }
        else {
            return input;
        }
    }

    const handleButtonUpdate = (question, field, questionType, value = null, inputType = null) => {
        if(questionType === 'checkbox-single') {
            setSelectedButtons(selectedButtons.map((item, index) => {
                if(index === question) {
                    return item.map((item, index) => {
                        return index === field;
                    });
                }
                else {
                    return item;
                }
            }));
        }
        else if(questionType === 'checkbox-multiple') {
            setSelectedButtons(selectedButtons.map((item, index) => {
                if(index === question) {
                    return item.map((item, index) => {
                        if(index === field) {
                            return !item;
                        }
                        else {
                            return item;
                        }
                    });
                }
                else {
                    return item;
                }
            }));
        }
        else if(questionType === 'input') {
            if(validateNumber(value) || !inputType) {
                setSelectedButtons(selectedButtons.map((item, index) => {
                    if(index === question) {
                        return item.map((item, index) => {
                            if(index === field) {
                                return value.replace(',', '.');
                            }
                            else {
                                return item;
                            }
                        });
                    }
                    else {
                        return item;
                    }
                }));
            }
        }
    }

    const validateNumber = (content) => {
        const lastChar = content[content.length-1];

        if(isInteger(lastChar) || lastChar === '.' || lastChar === ',') {
            if(lastChar === '.') {
                if(content.length > 1) {
                    return content.slice(0, -1).split('').findIndex((item) => (item === '.')) === -1;
                }
                else {
                    return false;
                }
            }
            else if(lastChar === ',') {
                return content.length > 1;
            }
            else {
                if(content.split('').findIndex((item) => (item === '.')) !== -1) {
                    const decimalPart = content.split('.')[content.split('.').length-1];

                    return decimalPart.length <= 2;
                }
                else {
                    return content.length < 3;
                }
            }
        }
        else if(content === '') {
            return true;
        }
        else {
            return false;
        }
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

            {!oldForm ? <main className="formPage">
                <h1 className="pageHeader">
                    Formularz weryfikacji buta do miary
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
                        Model:
                    </span>
                        <span>
                        {model}
                    </span>
                    </p>
                </div>

                {confirmForm && !success ? <p className="confirmForm__info">
                    Upewnij się, ze przesłane dane są poprawne. Po ich przesłaniu nie będzie możliwości ich zmiany.
                </p> : ''}

                {success ? <FormSubmitted header="Formularz został wysłany" /> : ''}

                {!success ? <>
                    {form?.map((item, sectionIndex) => {
                        let questionType = item.type;
                        return <section key={sectionIndex}
                                        className="formSection formSection--type2">
                            <h2 className="formSection__header formSection__header--formType2"
                                dangerouslySetInnerHTML={{__html: item.question}} >

                            </h2>

                            <div className="formSection__content">
                                {questionType === 'checkbox-single' ? <div className="formSection__checkbox">
                                    {item.fields?.map((item, index) => {
                                        return <label key={index}>
                                            <button className={selectedButtons[sectionIndex] ? (selectedButtons[sectionIndex][index] ? "form__check form__check--selected" : "form__check") : "form__check"}
                                                    onClick={() => { handleButtonUpdate(sectionIndex, index, questionType); }}
                                                    name={item}>
                                                <span></span>
                                            </button>
                                            <span>
                                                {renderTextAndInput(item, sectionIndex, index)}
                                            </span>
                                        </label>
                                    })}
                                </div> : ''}

                                {item.type === 'checkbox-multiple' ? <div className="formSection__checkbox">
                                    {item.fields?.map((item, index) => {
                                        return <label key={index} className={item.includes('input-text') ? 'label--withW100Input' : ''}>
                                            <button className={selectedButtons[sectionIndex] ? (selectedButtons[sectionIndex][index] ? "form__check form__check--selected" : "form__check") : "form__check"}
                                                    onClick={() => { handleButtonUpdate(sectionIndex, index, questionType); }}
                                                    name={item}>
                                                <span></span>
                                            </button>
                                            <span>
                                                {renderTextAndInput(item, sectionIndex, index)}
                                            </span>
                                        </label>
                                    })}
                                </div> : ''}

                                {item.type === 'images-multiple' ? <div className="formSection__imagesMultiple">
                                    {item.fields?.map((item, index) => {
                                        return <div className="formPage__label" key={index}>
                                            {item}
                                            {!images[item] ? <span className="formPage__imageWrapper">
                                        <input type="file" className="formPage__imageInput" multiple={false}
                                               onChange={(e) => { handleImageUpload(e, item); }} />
                                       <div className="editor__videoWrapper__placeholderContent">
                                            <p className="editor__videoWrapper__placeholderContent__text">
                                                Dodaj zdjęcie
                                            </p>
                                            <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                                    </div>
                                </span> : <div className="formPage__imgWrapper">
                                                <button className="formPage__deleteBtn"
                                                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImg(item); }}>
                                                    &times;
                                                </button>
                                                <div className="editor__videoWrapper__placeholderContent editor__videoWrapper__placeholderContent--check">
                                                    <p className="editor__videoWrapper__placeholderContent__text">
                                                        Zdjęcie dodane
                                                    </p>
                                                    <img className="editor__videoWrapper__icon editor__videoWrapper__icon--check" src={checkIcon} alt="video" />
                                                </div>
                                            </div>}
                                        </div>
                                    })}
                                </div> : ''}
                            </div>
                        </section>
                    })}

                    <p className="formEnd formEnd--type2">
                        W przypadku wątpliwości dotyczących przesłanych informacji, będziemy się dodatkowo kontaktować.
                    </p>

                    {validationError ? <span className="info info--error">
                        {language === 'pl' ? 'Odpowiedz na wszystkie pytania' : 'Answer all questions'}
                    </span> : ''}

                    {!loading ? <button className="btn btn--submit" onClick={() => { validateForm(); }}>
                        {confirmForm ? 'Prześlij' : 'Wyślij formularz'}
                    </button> : <div className="center marginTop">
                        <Loader />
                    </div>}
                </> : ''}
            </main> : <OldFormDataType2 data={oldForm} orderId={orderId} model={model} />}

        </main>

        <Footer />
    </div> : <LoadingPage />
};

export default FormType2;
