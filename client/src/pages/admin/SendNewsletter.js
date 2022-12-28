import React, {useEffect, useRef, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, EditorState } from 'draft-js';
import Dropzone from "react-dropzone-uploader";
import settings from "../../static/settings";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import trashIcon from '../../static/img/trash.svg'
import {generateImageLink} from "../../helpers/blog";
import imageIcon from "../../static/img/image-gallery.svg";
import {scrollToTop} from "../../helpers/others";
import Waiting from "../../components/admin/Loader";
import {getNewsletterInProgress, saveNewsletter, sendNewsletter, sendTestNewsletter} from "../../helpers/newsletter";

const SendNewsletter = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imgForLink, setImgForLink] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [modalPrevent, setModalPrevent] = useState(false);

    const linkModal = useRef(null);
    const addImageToArticlePlaceholder = useRef(null);

    useEffect(() => {
        getNewsletterInProgress()
            .then((res) => {
                if(res?.status === 200) {
                    const r = res?.data?.result[0];

                    if(r) {
                        setTitle(r.title);
                        setContent(EditorState.createWithContent(convertFromRaw(JSON.parse(r.content))));
                    }
                }
            })
    }, []);

    useEffect(() => {
        if(imgForLink) {
            addImageToArticlePlaceholder.current.style.visibility = 'hidden';
        }
        else {
            addImageToArticlePlaceholder.current.style.visibility = 'visible';
        }
    }, [imgForLink]);

    useEffect(() => {
        if(linkModal?.current) {
            if(generatedLink && imgForLink) {
                linkModal.current.style.visibility = 'visible';
            }
            else {
                linkModal.current.style.visibility = 'hidden';
            }
        }
    }, [generatedLink, imgForLink]);

    useEffect(() => {
        if(status) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [status]);

    const handleSubmitTest = (e) => {
        setLoading(true);
        if(title && content) {
            sendTestNewsletter(title, content)
                .then((res) => {
                    if(res?.status === 201) {
                        setStatus(2);
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

    const handleSubmit = (e) => {
        setLoading(true);
        if(title && content) {
            sendNewsletter(title, content)
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

    const deleteImgForLink = () => {
        imgForLink.remove();
        setImgForLink(null);
        setGeneratedLink(null);
    }

    const getUploadImage = (img) => {
        console.log(img);
    }

    const handleChangeStatusForImageForLink = (status) => {
        if(!modalPrevent) {
            setImgForLink(status);

            generateImageLink(imgForLink?.file)
                .then((res) => {
                    setGeneratedLink(res?.data?.result);
                });
        }
    }

    const copyToClipboard = () => {
        const input = document.createElement('textarea');
        input.innerHTML = `${settings.API_URL}/image?url=/media/blog/${generatedLink}`;
        document.body.appendChild(input);
        input.select();
        const result = document.execCommand('copy');
        document.body.removeChild(input);
        setGeneratedLink(null);
        return result;
    }

    const saveWork = () => {
        saveNewsletter(title, content)
            .then((res) => {
                if(res?.status === 201) {
                    setStatus(3);
                    setLoading(false);
                }
                else {
                    setStatus(-1);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setStatus(-1);
                setLoading(false);
            });
    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />

        {generatedLink ? <div className="modal" ref={linkModal}>
            <div className="modal__inner">
                <button className="modal__close" onClick={() => { setGeneratedLink(null); }}>
                    &times;
                </button>

                <h3 className="modal__header">
                    Link do zdjęcia:
                </h3>
                <h4 className="modal__link">
                    {`${settings.API_URL}/image?url=/media/blog/${generatedLink}`}
                </h4>

                <button className="modal__btn modal__btn--copy" onClick={() => { copyToClipboard(); }}>
                    Skopiuj link
                </button>
            </div>
        </div> : ''}

        <div className="admin">
            <AdminMenu menuOpen={7} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Wyślij newsletter
                </h2>
                {status ? <span className="admin__status">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : (status === 1 ? <span className="admin__status__inner admin__status--success">
                            Newsletter został wysłany
                        </span> : (status === 2 ? <span className="admin__status__inner admin__status--success">
                            Testowy newsletter został wysłany
                        </span> : <span className="admin__status__inner admin__status--success">
                            Newsletter został zapisany
                        </span>))}
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

                <div>
                    <h3 className="addAddon--imageHeader">
                        Dodaj zdjęcie do maila
                    </h3>
                    <label className="admin__label admin__flex admin__label--imageForLink">
                            <span className="admin__label__imgUpload">
                                {imgForLink ? <button className="admin__label__imgUpload__trashBtn admin__label__imgUpload__trashBtn--newsletter" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImgForLink(); }}>
                                    <img className="img" src={trashIcon} alt="usun" />
                                </button> : ""}
                                <div className="editor__videoWrapper__placeholderContent" ref={addImageToArticlePlaceholder}>
                                    <p className="editor__videoWrapper__placeholderContent__text">
                                        Kliknij tutaj lub upuść plik aby dodać zdjęcie
                                    </p>
                                    <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                                </div>
                                <Dropzone
                                    canRemove={true}
                                    getUploadParams={getUploadImage}
                                    onChangeStatus={(status) => { handleChangeStatusForImageForLink(status); }}
                                    accept="image/*"
                                    maxFiles={1} />
                            </span>
                    </label>
                </div>

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
                {loading ? <Waiting /> : <div className="newsletterButtons">
                    <div className="flex">
                        <button className="btn btn--admin btn--half"
                                onClick={(e) => { handleSubmitTest(e) }}>
                            Wyślij newsletter testowy
                        </button>
                        <button className="btn btn--admin btn--half"
                                onClick={(e) => { saveWork(); }}>
                            Dokończę później
                        </button>
                    </div>
                    <button className="btn btn--admin btn--marginTop"
                            onClick={() => { handleSubmit() }}>
                        Wyślij maila
                    </button>
                </div> }
            </main>
        </div>
    </div>
};

export default SendNewsletter;
