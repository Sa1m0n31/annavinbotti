import React, {useEffect} from 'react';
import constans from "../../helpers/constants";

const OldFormDataType2 = ({data, orderId, model}) => {
    return <div className="formPage formPage--oldForm">

        <h1 className="pageHeader">
            Formularz weryfikacji buta
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

        <div className="confirmForm">
            {data?.map((item, index) => {
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
};

export default OldFormDataType2;
