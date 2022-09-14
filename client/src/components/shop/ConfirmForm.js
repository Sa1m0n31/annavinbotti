import React, {useContext, useEffect, useState} from 'react';
import {getUserInfo, sendForm} from "../../helpers/user";
import Loader from "./Loader";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";
import FormSubmitted from "./FormSubmitted";

const ConfirmForm = ({data, formType, type, orderId}) => {
    const { language } = useContext(ContentContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFormSubmit = (formData) => {
        console.log('handleFormSubmit');
        getUserInfo()
            .then((res) => {
                const email = res?.data?.result[0]?.email;
                if(email) {
                    sendForm(formData, formType, orderId, type, data, email)
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

    useEffect(() => {
        if(error || success) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setLoading(false);
        }
    }, [error, success]);

    const prepareForm = () => {
        setLoading(true);
        const gallery = data?.map((item) => {
            return item?.filter((item) => {
                return item.type !== 1;
            });
        })
            ?.flat()
            ?.map((item) => {
                console.log(Object.entries(item));
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

        console.log(gallery);

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
                                    handleFormSubmit(formData);
                                }, 500);
                            }
                        });
                }
                else {
                    setTimeout(() => {
                        handleFormSubmit(formData);
                    }, 500);
                }
            };
            xhr.send();
        }
    }

    return <div className="confirmForm">

        {success ? <FormSubmitted header={language === 'pl' ? 'Formularz został wysłany' : 'Form has been submitted'} /> : ''}

        {!success ? <p className="confirmForm__info">
            Upewnij się, że przesłane dane są poprawne. Po przesłaniu wymiarów nie ma możliwości ich zmiany.
        </p> : ''}

        {!success ? data?.map((item, index) => {
            return <div className="formSection formSection--confirm" key={index}>
                {index === 0 || index === data?.length / 2 ? <h2 className="formSection__header">
                    {index === 0 ? 'Stopa prawa' : 'Stopa lewa'}
                </h2> : ''}

                {item?.map((item, index) => {
                    console.log(Object.entries(item)[1][1]?.fileUrl);
                    if(item.type === 1) {
                        return <p className="confirmForm__type1" key={index}>
                            <span className="confirmForm__type1__key">
                                {Object.entries(item)[1][0]?.split('-leg')[0]}:
                            </span>
                            <span>
                                {Object.entries(item)[1][1]}
                            </span>
                        </p>
                    }
                    else if(item.type === 2) {
                        return <figure className="confirmForm__type2">
                            <figcaption>
                                {Object.entries(item)[1][0]?.split('-leg')[0]}
                            </figcaption>
                            <img className="img" src={Object.entries(item)[1][1]?.fileUrl} alt={Object.entries(item)[1][0]} />
                        </figure>
                    }
                    else {
                        return <p className="confirmForm__type1" key={index}>
                            <span className="confirmForm__type1__key">
                                {Object.entries(item)[1][0]?.split('-number-leg')[0]}:
                            </span>
                            <span>
                                {Object.entries(item)[1][1]}
                            </span>
                            {Object.entries(item)?.length > 2 ? <figure className="confirmForm__type2">
                                <img className="img" src={Object.entries(item)[2][1]?.fileUrl} alt={Object.entries(item)[1][0]?.split('-image-leg')[0]} />
                            </figure> : ''}
                        </p>
                    }
                })}
            </div>
        }) : ''}

        {!success ? <>
            {error ? <span className="info info--error">
            {language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN}
        </span> : ''}

            {!loading ? <button className="btn btn--sendForm" onClick={() => { prepareForm(); }}>
                Prześlij wymiary
            </button> : <div className="center marginTop">
                <Loader />
            </div>}
        </> : ''}
    </div>
};

export default ConfirmForm;
