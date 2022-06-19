import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {addType, getTypeById, updateType} from "../../helpers/products";

const AddType = () => {
    const [id, setId] = useState(null);
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [status, setStatus] = useState(0);
    const [updateMode, setUpdateMode] = useState(false);

    useEffect(() => {
        const idParam = new URLSearchParams(window.location.search).get('id');
        if(idParam) {
            setId(parseInt(idParam));
            setUpdateMode(true);

            getTypeById(idParam)
                .then((res) => {
                    const result = res?.data?.result[0];
                    if(result) {
                        setNamePl(result.name_pl);
                        setNameEn(result.name_en);
                    }
                });
        }
    }, []);

    const createNewType = () => {
        if(namePl && nameEn) {
            if(updateMode) {
                updateType(id, namePl, nameEn)
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(2);
                        }
                        else {
                            setStatus(-1);
                        }
                    })
                    .catch(() => {
                        setStatus(-1);
                    });
            }
            else {
                addType(namePl, nameEn)
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(1);
                        }
                        else {
                            setStatus(-1);
                        }
                    })
                    .catch(() => {
                        setStatus(-1);
                    });
            }
        }
        else {
            setStatus(-2);
        }
    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={4} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj typ
                </h2>
                {status ? <span className="admin__status">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Typ został zaktualizowany' : 'Typ został dodany'}
                        </span>}
                </span> : ""}

                <label>
                    Nazwa typu (polski)
                    <input className="input"
                           placeholder="Polska nazwa typu"
                           value={namePl}
                           onChange={(e) => { setNamePl(e.target.value); }} />
                </label>
                <label>
                    Nazwa typu (angielski)
                    <input className="input"
                           placeholder="Angielska nazwa typu"
                           value={nameEn}
                           onChange={(e) => { setNameEn(e.target.value); }} />
                </label>

                <button className="btn btn--admin btn--admin--type" onClick={() => { createNewType(); }}>
                    {updateMode ? "Zaktualizuj typ" : "Dodaj typ"}
                </button>
            </main>
        </div>
    </div>
};

export default AddType;
