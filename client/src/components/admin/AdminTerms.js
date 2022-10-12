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
    const [page1, setPage1] = useState("");
    const [page2, setPage2] = useState("");
    const [page3, setPage3] = useState("");
    const [page4, setPage4] = useState("");
    const [page5, setPage5] = useState("");
    const [page6, setPage6] = useState("");
    const [page7, setPage7] = useState("");
    const [page8, setPage8] = useState("");
    const [page9, setPage9] = useState("");
    const [page10, setPage10] = useState("");
    const [page11, setPage11] = useState("");
    const [status, setStatus] = useState(0);

    useEffect(() => {
        const func = lang === 'pl' ? getTermsPl : getTermsEn;

        func()
            .then((res) => {
                const result = res?.data?.result;
                let termsLocal, policyLocal, page1Local, page2Local, page3Local, page4Local, page5Local,
                    page6Local, page7Local, page8Local, page9Local, page10Local, page11Local;

                if(lang === 'pl') {
                    termsLocal = result?.find((item) => {
                        return item.field === 'terms_of_service';
                    })?.value_pl;
                    policyLocal = result?.find((item) => {
                        return item.field === 'privacy_policy';
                    })?.value_pl;
                    page1Local = result?.find((item) => {
                        return item.field === 'page_1';
                    })?.value_pl;
                    page2Local = result?.find((item) => {
                        return item.field === 'page_2';
                    })?.value_pl;
                    page3Local = result?.find((item) => {
                        return item.field === 'page_3';
                    })?.value_pl;
                    page4Local = result?.find((item) => {
                        return item.field === 'page_4';
                    })?.value_pl;
                    page5Local = result?.find((item) => {
                        return item.field === 'page_5';
                    })?.value_pl;
                    page6Local = result?.find((item) => {
                        return item.field === 'page_6';
                    })?.value_pl;
                    page7Local = result?.find((item) => {
                        return item.field === 'page_7';
                    })?.value_pl;
                    page8Local = result?.find((item) => {
                        return item.field === 'page_8';
                    })?.value_pl;
                    page9Local = result?.find((item) => {
                        return item.field === 'page_9';
                    })?.value_pl;
                    page10Local = result?.find((item) => {
                        return item.field === 'page_10';
                    })?.value_pl;
                    page11Local = result?.find((item) => {
                        return item.field === 'page_11';
                    })?.value_pl;
                }
                else {
                    termsLocal = result?.find((item) => {
                        return item.field === 'terms_of_service';
                    })?.value_en;
                    policyLocal = result?.find((item) => {
                        return item.field === 'privacy_policy';
                    })?.value_en;
                    page1Local = result?.find((item) => {
                        return item.field === 'page_1';
                    })?.value_en;
                    page2Local = result?.find((item) => {
                        return item.field === 'page_2';
                    })?.value_en;
                    page3Local = result?.find((item) => {
                        return item.field === 'page_3';
                    })?.value_en;
                    page4Local = result?.find((item) => {
                        return item.field === 'page_4';
                    })?.value_en;
                    page5Local = result?.find((item) => {
                        return item.field === 'page_5';
                    })?.value_en;
                    page6Local = result?.find((item) => {
                        return item.field === 'page_6';
                    })?.value_en;
                    page7Local = result?.find((item) => {
                        return item.field === 'page_7';
                    })?.value_en;
                    page8Local = result?.find((item) => {
                        return item.field === 'page_8';
                    })?.value_en;
                    page9Local = result?.find((item) => {
                        return item.field === 'page_9';
                    })?.value_en;
                    page10Local = result?.find((item) => {
                        return item.field === 'page_10';
                    })?.value_en;
                    page11Local = result?.find((item) => {
                        return item.field === 'page_11';
                    })?.value_en;
                }

                setTerms(EditorState.createWithContent(convertFromRaw(JSON.parse(termsLocal))));
                setPolicy(EditorState.createWithContent(convertFromRaw(JSON.parse(policyLocal))));
                setPage1(EditorState.createWithContent(convertFromRaw(JSON.parse(page1Local))));
                setPage2(EditorState.createWithContent(convertFromRaw(JSON.parse(page2Local))));
                setPage3(EditorState.createWithContent(convertFromRaw(JSON.parse(page3Local))));
                setPage4(EditorState.createWithContent(convertFromRaw(JSON.parse(page4Local))));
                setPage5(EditorState.createWithContent(convertFromRaw(JSON.parse(page5Local))));
                setPage6(EditorState.createWithContent(convertFromRaw(JSON.parse(page6Local))));
                setPage7(EditorState.createWithContent(convertFromRaw(JSON.parse(page7Local))));
                setPage8(EditorState.createWithContent(convertFromRaw(JSON.parse(page8Local))));
                setPage9(EditorState.createWithContent(convertFromRaw(JSON.parse(page9Local))));
                setPage10(EditorState.createWithContent(convertFromRaw(JSON.parse(page10Local))));
                setPage11(EditorState.createWithContent(convertFromRaw(JSON.parse(page11Local))));
            })
    }, []);

    const handleSubmit = () => {
        const func = lang === 'pl' ? updateTermsPl : updateTermsEn;

        func(terms, policy, page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11)
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
                    Edycja podstron (wersja {lang === 'pl' ? 'polska' : 'angielska'})
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
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Polityka prywatności*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={policy}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPolicy(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        O nas*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page1}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage1(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Nasze wartości*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page2}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage2(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Jak powstają*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page3}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage3(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Jak zamawiać*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page4}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage4(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Jak mierzyć stopę - czółenka*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page5}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage5(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Jak mierzyć stopę - oficerki*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page11}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage11(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Jak pielęgnować*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page6}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage6(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Gwarancja*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page7}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage7(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Oświadczenie reklamacyjne*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page8}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage7(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                {/*<section className="admin__editorWrapper">*/}
                {/*    <h3 className="editorWrapper__header">*/}
                {/*        Adres korespondencyjny*/}
                {/*    </h3>*/}
                {/*    <Editor*/}
                {/*        editorState={page10}*/}
                {/*        toolbarClassName="toolbarClassName"*/}
                {/*        wrapperClassName="wrapperClassName"*/}
                {/*        editorClassName="editor"*/}
                {/*        onEditorStateChange={(text) => { setPage10(text); }}*/}
                {/*    />*/}
                {/*</section>*/}
                <button className="btn btn--admin btn--marginTop" onClick={() => { handleSubmit() }}>
                    Aktualizuj podstrony
                </button>
            </main>
        </div>
    </div>
};

export default AdminTerms;
