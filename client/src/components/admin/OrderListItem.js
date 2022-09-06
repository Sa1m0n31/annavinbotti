import React, {useEffect, useState} from 'react';
import eyeIcon from '../../static/img/eye.svg'

const OrderListItem = ({index, id, name, date, status}) => {
    const [orderStatus, setOrderStatus] = useState('');

    useEffect(() => {
        if(!status) {
            setOrderStatus('Anulowane');
        }
        else if(status < 8) {
            setOrderStatus('W trakcie');
        }
        else if(status === 8) {
            setOrderStatus('Zakończone');
        }
    }, [status]);

    return <section className="admin__main__notification__item" key={index}>
        <section className="admin__main__notification__item__col col-3">
            <h3 className="admin__main__notification__item__key">
                id
            </h3>
            <h4 className="admin__main__notification__item__value">
                {id}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Zamawiający
            </h3>
            <h4 className="admin__main__notification__item__value">
                {name}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Status
            </h3>
            <h4 className="admin__main__notification__item__value">
                {orderStatus}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Złożone
            </h3>
            <h4 className="admin__main__notification__item__value">
                <span>
                    {date?.split('T')[0]}
                </span>
                <span>
                    {date?.split('T')[1]?.substring(0, 8)}
                </span>
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-4">
            <h3 className="admin__main__notification__item__key">
                Akcje
            </h3>
            <section className="admin__main__notification__item__buttons">
                <a className="admin__main__notification__item__btn" href={`/szczegoly-zamowienia?id=${id}`}>
                    <img className="btn__img" src={eyeIcon} alt="edytuj" />
                </a>
            </section>
        </section>
    </section>
};

export default OrderListItem;
