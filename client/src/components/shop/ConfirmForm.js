import React, {useContext, useEffect, useState} from 'react';
import {sendForm} from "../../helpers/user";
import Loader from "./Loader";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const ConfirmForm = ({data, formType, type, orderId}) => {
    useEffect(() => {
        console.log(data);
    }, [data]);

    const { language } = useContext(ContentContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFormSubmit = (formData) => {
        sendForm(formData, formType, orderId, type, data)
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

    useEffect(() => {
        if(error || success) {
            setLoading(false);
        }
    }, [error, success]);

    const prepareForm = () => {
        setLoading(true);
        const gallery = data?.map((item) => {
            return item?.filter((item) => {
                return item.type === 2;
            });
        })
            ?.flat()
            ?.map((item) => {
                return {
                    [Object.entries(item)[1][0]]: Object.entries(item)[1][1]?.fileUrl
                }
            });

        console.log(gallery);

        let formData = new FormData();
        for(let i=0; i<gallery.length; i++) {
            const item = Object.entries(gallery[i])[0][1];
            const itemName = Object.entries(gallery[i])[0][0];

            console.log(item, itemName);

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
        {data?.map((item, index) => {
            return <div className="formSection formSection--confirm" key={index}>
                {index === 0 || index === data?.length / 2 ? <h2 className="formSection__header">
                    {index === 0 ? 'Stopa prawa' : 'Stopa lewa'}
                </h2> : ''}

                {item?.map((item, index) => {
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
                })}
            </div>
        })}

        <p className="confirmForm__info">
            Upewnij się, że przesłane dane są poprawne. Po przesłaniu wymiarów nie ma możliwości ich zmiany.
        </p>

        {error ? <span className="info info--error">
            {language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN}
        </span> : ''}

        {success ? <span className="info">
            {language === 'pl' ? 'Formularz został wysłany' : 'Form has been submitted'}
        </span> : ''}

        {!loading ? <button className="btn btn--sendForm" onClick={() => { prepareForm(); }}>
            Prześlij wymiary
        </button> : <div className="center marginTop">
            <Loader />
        </div>}
    </div>
};

export default ConfirmForm;
