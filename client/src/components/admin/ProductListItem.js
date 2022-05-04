import React from 'react';
import penIcon from '../../static/img/pen.svg'
import trashIcon from '../../static/img/trash.svg'

const ProductListItem = ({index, name, img, type, date, id, openDeleteModal, addonType}) => {
    const getAddonTypeById = (id) => {
        switch(id) {
            case 1:
                return 'Tekst';
            case 2:
                return 'Tekst + zdjęcie';
            default:
                return 'Kolor';
        }
    }

    return <section className={addonType ? "admin__main__notification__item admin__main__notification__item--addon" : "admin__main__notification__item"} key={index}>
        {!addonType ? <section className="admin__main__notification__item__col col-2">
            <img className="btn__img" src={img} alt={name} />
        </section> : ''}
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
                Typ
            </h3>
            <h4 className="admin__main__notification__item__value">
                {addonType ? getAddonTypeById(addonType) : type}
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
                <a className="admin__main__notification__item__btn" href={`/${addonType ? 'edytuj-dodatek' : 'edytuj-produkt'}?id=${id}`}>
                    <img className="btn__img" src={penIcon} alt="edytuj" />
                </a>
            </section>
        </section>
    </section>
};

export default ProductListItem;
