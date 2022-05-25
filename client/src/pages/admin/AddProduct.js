import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import {getAddonsByProduct, getAllAddons, getProductDetails} from "../../helpers/products";

const AddProduct = () => {
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descriptionPl, setDescriptionPl] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [detailsPl, setDetailsPl] = useState("");
    const [detailsEn, setDetailsEn] = useState("");
    const [price, setPrice] = useState(null);
    const [addons, setAddons] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [updateMode, setUpdateMode] = useState(false);

    const isElementInArray = (el, arr) => {
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');

        if(id) {
            setUpdateMode(true);

            getProductDetails(id)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result) {

                    }
                });

            getAllAddons()
                .then((res) => {
                    if(res?.status === 200) {
                        const addonsLocal = res?.data?.result;
                        setAddons(addonsLocal);
                        getAddonsByProduct(id)
                            .then((res) => {
                                const result = res?.data?.result;
                                const idArray = result?.map((item) => {
                                    return item.id;
                                });
                                if(result) {
                                    setSelectedAddons(addonsLocal?.map((item) => {
                                        return isElementInArray(item.id, idArray);
                                    }));
                                }
                            });
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
        else {
            getAllAddons()
                .then((res) => {
                    if(res?.status === 200) {
                        setAddons(res?.data?.result);
                        setSelectedAddons(res?.data?.result?.map((item) => {
                            return false;
                        }));
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
    }, []);

    const updateSelectedAddons = (i) => {
        setSelectedAddons(selectedAddons?.map((item, index) => {
            return index === i ? !item : item;
        }));
    }

    const createNewProduct = () => {

    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={1} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj produkt
                </h2>
                    <label>
                        Nazwa produktu (polski)
                        <input className="input"
                               placeholder="Polska nazwa produktu"
                               value={namePl}
                               onChange={(e) => { setNamePl(e.target.value); }} />
                    </label>
                    <label>
                        Nazwa produktu (angielski)
                        <input className="input"
                               placeholder="Angielska nazwa produktu"
                               value={nameEn}
                               onChange={(e) => { setNameEn(e.target.value); }} />
                    </label>
                    <label>
                        Cena
                        <input className="input input--100"
                               placeholder="Cena produktu"
                               type="number"
                               step={0.01}
                               value={price}
                               onChange={(e) => { setPrice(e.target.value); }} />
                    </label>
                    <label>
                        Opis produktu (polski)
                        <Editor
                            editorState={descriptionPl}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescriptionPl(text); }}
                        />
                    </label>
                    <label>
                        Opis produktu (angielski)
                        <Editor
                            editorState={descriptionEn}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescriptionEn(text); }}
                        />
                    </label>
                    <label>
                        Szczegóły produktu (polski)
                        <Editor
                            editorState={detailsPl}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDetailsPl(text); }}
                        />
                    </label>
                    <label>
                        Szczegóły produktu (angielski)
                        <Editor
                            editorState={detailsEn}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDetailsEn(text); }}
                        />
                    </label>
                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Wybierz dodatki do wyboru dla klienta
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        {addons?.map((item, index) => {
                            return <label className="addProduct__addonsSection__label">
                                <button className={selectedAddons[index] ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                        onClick={() => { updateSelectedAddons(index); }}>

                                </button>
                                <span>
                                    {item.name_pl}
                                </span>
                            </label>
                        })}
                    </div>
                </div>


                <button className="btn btn--admin" onClick={() => { createNewProduct(); }}>
                    Dodaj produkt
                </button>
            </main>
        </div>
    </div>
};

export default AddProduct;
