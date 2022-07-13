import React from 'react';
import constans from "../../helpers/constants";

const OldFormData = ({data, orderId, type}) => {
    return <div className="formPage formPage--oldForm">

        <h1 className="pageHeader">
            Twoje wymiary
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

        <div className="confirmForm">
            <h2 className="formSection__header">
                Stopa lewa
            </h2>
            {data?.left?.map((item, index) => {
                if(item.type === 'txt') {
                    return <p className="confirmForm__type1" key={index}>
                            <span className="confirmForm__type1__key">
                                {item.name}:
                            </span>
                        <span>
                                {item.value}
                            </span>
                    </p>
                }
                else if(item.type === 'img') {
                    return <figure className="confirmForm__type2">
                        <figcaption>
                            {item.name}
                        </figcaption>
                        <img className="img" src={`${constans.IMAGE_URL}/media/filled-forms/${item.value}`} alt={item.name} />
                    </figure>
                }
            })}

            <h2 className="formSection__header">
                Stopa prawa
            </h2>
            {data?.right?.map((item, index) => {
                if(item.type === 'txt') {
                    return <p className="confirmForm__type1" key={index}>
                            <span className="confirmForm__type1__key">
                                {item.name}:
                            </span>
                        <span>
                                {item.value}
                            </span>
                    </p>
                }
                else if(item.type === 'img') {
                    return <figure className="confirmForm__type2">
                        <figcaption>
                            {item.name}
                        </figcaption>
                        <img className="img" src={`${constans.IMAGE_URL}/media/filled-forms/${item.value}`} alt={item.name} />
                    </figure>
                }
            })}
        </div>
    </div>
};

export default OldFormData;
