import React from 'react';
import penIcon from '../../static/img/pen.svg'
import trashIcon from '../../static/img/trash.svg'

const StockListItem = ({index, id, name, counter, openDeleteModal, type}) => {
    return <section className="admin__main__notification__item" key={index}>
        <section className="admin__main__notification__item__col col-3">
            <h3 className="admin__main__notification__item__key">
                Nazwa
            </h3>
            <h4 className="admin__main__notification__item__value">
                {name}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Wartość
            </h3>
            <h4 className="admin__main__notification__item__value">
                {counter}
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-4">
            <h3 className="admin__main__notification__item__key">
                Akcje
            </h3>
            <section className="admin__main__notification__item__buttons">
                <button className="admin__main__notification__item__btn admin__main__notification__item__btn--block" onClick={() => { openDeleteModal(id, name); }}>
                    <img className="btn__img" src={trashIcon} alt="zablokuj" />
                </button>
                <a className="admin__main__notification__item__btn" href={`/dodaj-stan-magazynowy-${type === 0 ? 'produktow' : 'dodatkow'}?id=${id}`}>
                    <img className="btn__img" src={penIcon} alt="edytuj" />
                </a>
            </section>
        </section>
    </section>
};

export default StockListItem;
