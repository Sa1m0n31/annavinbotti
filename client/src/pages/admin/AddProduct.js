import React, {useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';

const AddProduct = () => {
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descriptionPl, setDescriptionPl] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [detailsPl, setDetailsPl] = useState("");
    const [detailsEn, setDetailsEn] = useState("");
    const [price, setPrice] = useState(null);

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
                <label>
                    Cena
                    <input className="input input--100"
                           placeholder="Cena produktu"
                           type="number"
                           step={0.01}
                           value={price}
                           onChange={(e) => { setPrice(e.target.value); }} />
                </label>


                <button className="btn btn--admin" onClick={() => { createNewProduct(); }}>
                    Dodaj produkt
                </button>
            </main>
        </div>
    </div>
};

export default AddProduct;
