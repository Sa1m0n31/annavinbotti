import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {Editor} from "react-draft-wysiwyg";
import {getTermsEn, getTermsPl, updateTermsEn, updateTermsPl} from "../../helpers/content";
import {convertFromRaw, EditorState} from "draft-js";
import {scrollToTop} from "../../helpers/others";

const AdminTerms = ({lang}) => {
    const [terms, setTerms] = useState('');
    const [policy, setPolicy] = useState('');
    const [status, setStatus] = useState(0);

    useEffect(() => {
        const func = lang === 'pl' ? getTermsPl : getTermsEn;

        func()
            .then((res) => {
                const result = res?.data?.result;
                let termsLocal, policyLocal;

                if(lang === 'pl') {
                    termsLocal = result?.find((item) => {
                        return item.field === 'terms_of_service';
                    })?.value_pl;
                    policyLocal = result?.find((item) => {
                        return item.field === 'privacy_policy';
                    })?.value_pl;
                }
                else {
                    termsLocal = result?.find((item) => {
                        return item.field === 'terms_of_service';
                    })?.value_en;
                    policyLocal = result?.find((item) => {
                        return item.field === 'privacy_policy';
                    })?.value_en;
                }

                setTerms(EditorState.createWithContent(convertFromRaw(JSON.parse(termsLocal))));
                setPolicy(EditorState.createWithContent(convertFromRaw(JSON.parse(policyLocal))));
            })
    }, []);

    const handleSubmit = () => {
        const func = lang === 'pl' ? updateTermsPl : updateTermsEn;

        func(terms, policy)
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

    useEffect(() => {
        if(status) {
            scrollToTop();
        }
    }, [status]);

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={8} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Edycja regulaminów (wersja {lang === 'pl' ? 'polska' : 'angielska'})
                </h2>
                {status ? <span className="admin__status admin__status--right">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            Regulaminy zostały zaktualizowane
                        </span>}
                </span> : ""}

                <section className="admin__editorWrapper">
                    <h3 className="editorWrapper__header">
                        Regulamin sklepu
                    </h3>
                    <Editor
                        editorState={terms}
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setTerms(text); }}
                    />
                </section>
                <section className="admin__editorWrapper">
                    <h3 className="editorWrapper__header">
                        Polityka prywatności
                    </h3>
                    <Editor
                        editorState={policy}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setPolicy(text); }}
                    />
                </section>
                <button className="btn btn--admin btn--marginTop" onClick={() => { handleSubmit() }}>
                    Aktualizuj regulaminy
                </button>
            </main>
        </div>
    </div>
};

export default AdminTerms;
