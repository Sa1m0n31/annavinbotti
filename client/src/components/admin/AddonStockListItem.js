import React, {useEffect, useState} from 'react';
import penIcon from '../../static/img/pen.svg'
import trashIcon from '../../static/img/trash.svg'
import {updateAddonStock} from "../../helpers/stocks";

const AddonStockListItem = ({index, id, name, counter, adminName}) => {
    const [stock, setStock] = useState(0);
    const [editionInProgress, setEditionInProgress] = useState(false);
    const [updateResult, setUpdateResult] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStock(counter);
    }, [counter]);

    useEffect(() => {
        if(stock < 0) {
            setStock(0);
        }
    }, [stock]);

    useEffect(() => {
        if(updateResult) {
            setTimeout(() => {
                setUpdateResult(0);
            }, 3000);
        }
    }, [updateResult]);

    const editStock = () => {
        if(editionInProgress) {
            if(!isNaN(stock)) {
                setLoading(true);
                updateAddonStock(id, stock)
                    .then((res) => {
                        if(res?.status === 201) {
                            setUpdateResult(1);
                        }
                        else {
                            setUpdateResult(-1);
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        setUpdateResult(-1);
                    });
            }
            else {
                setUpdateResult(-2);
            }
        }

        setEditionInProgress(prevState => (!prevState));
    }

    return <section className="admin__main__notification__item" key={index}>
        <section className="admin__main__notification__item__col col-3">
            <h3 className="admin__main__notification__item__key">
                Nazwa
            </h3>
            <h4 className="admin__main__notification__item__value">
                {adminName}
                <span className="admin__value--small">
                    ({name})
                </span>
            </h4>
        </section>
        <section className="admin__main__notification__item__col col-2">
            <h3 className="admin__main__notification__item__key">
                Wartość
            </h3>
            {editionInProgress ? <input className="admin__addonStock__input"
                                        type="number"
                                        value={stock}
                                        onChange={(e) => { setStock(e.target.value); }} /> : <h5 className="admin__main__notification__item__value">
                {stock}
            </h5>}
        </section>
        <section className="admin__main__notification__item__col col-4">
            <h3 className="admin__main__notification__item__key">
                Akcje
            </h3>
            {!updateResult && !loading ? <section className="admin__main__notification__item__buttons">
                <button className={editionInProgress ? "btn--addonsStock btn--positive" : "btn--addonsStock"}
                        onClick={() => { editStock(); }}>
                    {editionInProgress ? 'Zatwierdź zmiany' : 'Edytuj stan'}
                </button>
                {editionInProgress ? <button className="btn--addonsStock btn--delete"
                                             onClick={() => { setStock(counter); setEditionInProgress(false); }}>
                    Odrzuć zmiany
                </button> : ''}
            </section> : (updateResult === 1 ? <p className="info info--success">
                Stan magazynowy został zmieniony
            </p> : (updateResult === -1 || updateResult === -2 ? <p className="info info--error">
                {updateResult === -1 ? 'Coś poszło nie tak... Prosimy skontaktować się z administratorem' : 'Podaj poprawną liczbę'}
            </p> : ''))}
        </section>
    </section>
};

export default AddonStockListItem;
