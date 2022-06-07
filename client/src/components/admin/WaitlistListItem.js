import React from 'react';
import eyeIcon from '../../static/img/eye.svg'

const WaitlistListItem = ({index, id, name, count}) => {
    return <section className="admin__main__notification__item" key={index}>
        <section className="admin__main__notification__item__col col-3">
            <h3 className="admin__main__notification__item__key">
                Model
            </h3>
            <h4 className="admin__main__notification__item__value">
                {name}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Osoby na waitliście
            </h3>
            <h4 className="admin__main__notification__item__value">
                {count}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-4">
            <h3 className="admin__main__notification__item__key">
                Szczegóły
            </h3>
            <section className="admin__main__notification__item__buttons">
                <a className="admin__main__notification__item__btn" href={`/szczegoly-waitlisty?id=${id}`}>
                    <img className="btn__img" src={eyeIcon} alt="edytuj" />
                </a>
            </section>
        </section>
    </section>
};

export default WaitlistListItem;
