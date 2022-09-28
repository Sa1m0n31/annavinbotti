import React, {useEffect, useRef, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Dropzone from "react-dropzone-uploader";
import settings from "../../static/settings";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import trashIcon from '../../static/img/trash.svg'
import {addBlogPost, generateImageLink, getBlogPost, updateBlogPost} from "../../helpers/blog";
import imageIcon from "../../static/img/image-gallery.svg";
import {scrollToTop} from "../../helpers/others";
import Waiting from "../../components/admin/Loader";
import {sendMailToClients, sendNewsletter} from "../../helpers/newsletter";

const SendEmailToClients = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(status) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [status]);

    const handleSubmit = (e) => {
        setLoading(true);
        if(title && content) {
            sendMailToClients(title, content)
                .then((res) => {
                    if(res?.status === 201) {
                        setStatus(1);
                        setLoading(false);
                    }
                    else {
                        setStatus(-1);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setStatus(-1);
                    setLoading(false);
                });
        }
        else {
            setLoading(false);
            setStatus(-2);
            scrollToTop();
        }
    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={9} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Wyślij zbiorczy mail do wszystkich klientów
                </h2>
                {status ? <span className="admin__status admin__status--sendMail">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            Mail został wysłany
                        </span>}
                </span> : ""}

                <section className="admin__articleTitle">
                    <label>
                        Tytuł *
                        <input className="input"
                               name="title"
                               value={title}
                               onChange={(e) => { setTitle(e.target.value); }}
                               placeholder="Tu wpisz tytuł maila" />
                    </label>
                </section>
                <section className="admin__editorWrapper">
                    <h3 className="editorWrapper__header">
                        Treść maila
                    </h3>
                    <Editor
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                        }}
                        editorState={content}
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setContent(text); }}
                    />
                </section>
                {loading ? <Waiting /> : <button className="btn btn--admin btn--marginTop"
                                                 onClick={() => { handleSubmit() }}>
                    Wyślij maila
                </button>}
            </main>
        </div>
    </div>
};

export default SendEmailToClients;
