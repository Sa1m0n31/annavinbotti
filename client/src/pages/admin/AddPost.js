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
import {createSlug, scrollToTop} from "../../helpers/others";
import Waiting from "../../components/admin/Loader";
import draftToHtml from "draftjs-to-html";

const AddPost = () => {
    const [id, setId] = useState(null);
    const [titlePl, setTitlePl] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [excerptPl, setExcerptPl] = useState("");
    const [excerptEn, setExcerptEn] = useState("");
    const [contentPl, setContentPl] = useState("");
    const [contentEn, setContentEn] = useState("");
    const [status, setStatus] = useState(0);
    const [updateMode, setUpdateMode] = useState(false);
    const [mainImage, setMainImage] = useState(null);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [oldMainImage, setOldMainImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imgForLink, setImgForLink] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [modalPrevent, setModalPrevent] = useState(false);

    const inputRef = useRef(null);
    const linkModal = useRef(null);
    const addImageToArticlePlaceholder = useRef(null);

    useEffect(() => {
        if(imgForLink) {
            addImageToArticlePlaceholder.current.style.visibility = 'hidden';
        }
        else {
            addImageToArticlePlaceholder.current.style.visibility = 'visible';
        }
    }, [imgForLink]);

    useEffect(() => {
        const idParam = new URLSearchParams(window.location.search).get('id');

        if(idParam) {
            setId(idParam);
            setUpdateMode(true);

            getBlogPost(idParam)
                .then((res) => {
                    const result = res?.data?.result[0];
                    if(result) {
                        setOldMainImage(result.image);
                        setTitlePl(result.title_pl);
                        setTitleEn(result.title_en);
                        setExcerptPl(result.excerpt_pl);
                        setExcerptEn(result.excerpt_en);
                        setContentPl(EditorState.createWithContent(convertFromRaw(JSON.parse(result.content_pl))));
                        setContentEn(EditorState.createWithContent(convertFromRaw(JSON.parse(result.content_en))));
                    }
                });
        }
    }, []);

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

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        const fileUrl = window.URL.createObjectURL(file);
        setOldMainImage(null);
        setMainImageFile(file);
        setMainImage(fileUrl);
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
        if(titlePl && titleEn && excerptPl && excerptEn && (mainImageFile || oldMainImage)) {
            if(updateMode) {
                updateBlogPost(id, titlePl, titleEn, excerptPl, excerptEn, contentPl, contentEn, mainImageFile)
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
                addBlogPost(titlePl, titleEn, excerptPl, excerptEn, contentPl, contentEn, mainImageFile)
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
        }
        else {
            setLoading(false);
            setStatus(-2);
            scrollToTop();
        }
    }

    const showPreview = () => {
        if(updateMode) {
            window.open(`${settings.WEBSITE_URL}/post/${createSlug(titlePl)}`, '_blank');
        }
        else {
            const articleObject = {
                title_pl: titlePl,
                title_en: titleEn,
                content_pl: draftToHtml(JSON.parse(JSON.stringify(convertToRaw(contentPl?.getCurrentContent())))),
                content_en: draftToHtml(JSON.parse(JSON.stringify(convertToRaw(contentPl?.getCurrentContent())))),
                image: mainImage,
                publication_date: new Date()
            }

            localStorage.setItem('articleObject', JSON.stringify(articleObject));

            window.open(`${settings.WEBSITE_URL}/podglad-artykulu`, '_blank');
        }
    }

    return <div className="container container--admin container--addProduct">

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

        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={6} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj artykuł
                </h2>
                {status ? <span className="admin__status">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Wpis został zaktualizowany' : 'Wpis został dodany'}
                        </span>}
                </span> : ""}

                <section className="admin__articleTitle">
                    <label>
                        Tytuł (polski) *
                        <input className="input"
                               name="titlePl"
                               value={titlePl}
                               onChange={(e) => { setTitlePl(e.target.value); }}
                               placeholder="Tu wpisz polski tytuł artykułu" />
                    </label>
                    <label>
                        Tytuł (angielski) *
                        <input className="input"
                               name="titleEn"
                               value={titleEn}
                               onChange={(e) => { setTitleEn(e.target.value); }}
                               placeholder="Tu wpisz angielski tytuł artykułu" />
                    </label>
                    <label>
                        Zajawka (polska) *
                        <textarea className="input input--textarea"
                                  name="excerptPl"
                                  value={excerptPl}
                                  onChange={(e) => { setExcerptPl(e.target.value); }}
                                  placeholder="Tu wpisz polską zajawkę artykułu" />
                    </label>
                    <label>
                        Zajawka (angielska) *
                        <textarea className="input input--textarea"
                                  name="excerptEn"
                                  value={excerptEn}
                                  onChange={(e) => { setExcerptEn(e.target.value); }}
                                  placeholder="Tu wpisz angielską zajawkę artykułu" />
                    </label>
                </section>
                <div className="flex adminBlog__images">
                    <div>
                        <h3 className="addAddon--imageHeader">
                            Zdjęcie wyróżniające artykułu *
                        </h3>
                        <div className="uploadGalleryWrapper">
                            <div className="editor__mainImageWrapper">
                                {oldMainImage ? <div className="oldImgWrapper z-index-1000">
                                        <button className="deleteOldImg" onClick={() => { setOldMainImage(null); }}>
                                            &times;
                                        </button>
                                        <img className="editor__video" src={`${settings.API_URL}/image?url=/media/blog/${oldMainImage}`} alt="placeholder" />
                                    </div>
                                    : <div className="oldImgWrapper z-index-0">
                                        {mainImage ? <button className="deleteOldImg" onClick={() => { setOldMainImage(null); setMainImageFile(null); setMainImage(null); }}>
                                            &times;
                                        </button> : ''}
                                        <img className={mainImage ? "editor__video" : "editor__video opacity-0"} src={mainImage} alt="placeholder" />
                                    </div>}

                                {!mainImage ? <span className="editor__mainImage__placeholder">
                                <input type="file" className="editor__files__input" ref={inputRef} multiple={false}
                                       onChange={(e) => { handleMainImageUpload(e); }} />
                               <div className="editor__videoWrapper__placeholderContent">
                                    <p className="editor__videoWrapper__placeholderContent__text">
                                        Kliknij tutaj lub upuść plik aby dodać zdjęcie
                                    </p>
                                    <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />
                               </div>
                        </span> : <input type="file" className="editor__files__input" ref={inputRef} multiple={false}
                                         onChange={(e) => { handleMainImageUpload(e); }} />}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="addAddon--imageHeader">
                            Dodaj zdjęcie do artykułu
                        </h3>
                        <label className="admin__label admin__flex admin__label--imageForLink">
                            <span className="admin__label__imgUpload">
                                {imgForLink ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImgForLink(); }}>
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
                </div>
                <section className="admin__editorWrapper">
                    <h3 className="editorWrapper__header">
                        Treść wpisu (polski)
                    </h3>
                    <Editor
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                        }}
                        editorState={contentPl}
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setContentPl(text); }}
                    />
                </section>
                <section className="admin__editorWrapper">
                    <h3 className="editorWrapper__header">
                        Treść wpisu (angielski)
                    </h3>
                    <Editor
                        editorState={contentEn}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editor"
                        onEditorStateChange={(text) => { setContentEn(text); }}
                    />
                </section>
                {loading ? <Waiting /> : <div className="marginTop">
                    <button className="btn btn--admin btn--preview" onClick={() => { showPreview(); }}>
                        Podgląd artykułu
                    </button>
                    <button className="btn btn--admin btn--marginTop" onClick={() => { handleSubmit() }}>
                        {updateMode ? "Aktualizuj artykuł" : "Dodaj artykuł"}
                    </button>
                </div>}
            </main>
        </div>
    </div>
};

export default AddPost;
