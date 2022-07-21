import React, {useEffect, useState} from 'react';
import eyeIcon from '../../static/img/eye.svg'

const AdminOrderCart = ({cart, orderId}) => {
    const [details, setDetails] = useState(-1);

    useEffect(() => {
        console.log(cart);
    }, [cart]);

    const toggleDetails = (i) => {
        setDetails(i === details ? -1 : i);
    }

    return <div className="admin__order__cart">
        <div className="admin__order__cart__header">
            <span>
                Produkt
            </span>
            <span>
                Typ produktu
            </span>
            <span>
                Cena
            </span>
            <span>
                Szczegóły
            </span>
        </div>
        {cart?.map((item, index) => {
            return <div className="admin__order__cart__item">
                <span>
                    {item[1][0].product}
                </span>
                <span>
                    {item[1][0].type}
                </span>
                <span>
                    {item[1][0].price} PLN
                </span>
                <span>
                    <button className="admin__order__cart__item__btn" onClick={() => { toggleDetails(index); }}>
                        <img className="btn__img" src={eyeIcon} alt="rozwin-szczegoly" />
                    </button>
                </span>

                {details === index ? <div className="admin__order__cart__item__details">
                    <div className="admin__order__cart__item__details__addons">
                        {item[1][0]?.addons?.map((item, index) => {
                            return <p className="admin__order__cart__item__details__addon">
                                {item.addon}: <b>{item.option}</b>
                            </p>
                        })}
                    </div>
                    <div className="admin__order__cart__item__details__buttons">
                        <a className={item.firstForm ? "admin__order__cart__item__details__btn" : "admin__order__cart__item__details__btn o-5"}
                           href={`/formularz?form=${item?.firstForm?.form}&sell=${item?.firstForm?.sell}`}>
                            Formularz mierzenia stopy
                        </a>
                        <a className={item.secondForm ? "admin__order__cart__item__details__btn" : "admin__order__cart__item__details__btn o-5"}
                           href={`/formularz-weryfikacji?order=${orderId}&model=${item?.productId}`}>
                            Formularz weryfikacji
                        </a>
                    </div>
                </div> : ''}
            </div>
        })}
    </div>
};

export default AdminOrderCart;
