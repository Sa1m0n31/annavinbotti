import React, {useEffect, useRef, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import settings from "../../static/settings";
import Dropzone from "react-dropzone-uploader";
import ColorModal from "../../components/admin/ColorModal";
import {
    addAddon,
    addAddonOption,
    deleteAddonOptions,
    getAddonById,
    getOptionsByAddon,
    updateAddon
} from "../../helpers/products";
import Waiting from "../../components/admin/Loader";
import {scrollToTop} from "../../helpers/others";
import ImagePreview from "../../components/admin/ImagePreview";
import imageIcon from "../../static/img/image-gallery.svg";

const AddAddon = () => {
    const [id, setId] = useState(0);
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [infoPl, setInfoPl] = useState("");
    const [infoEn, setInfoEn] = useState("");
    const [tooltipPl, setTooltipPl] = useState("");
    const [tooltipEn, setTooltipEn] = useState("");
    const [addonType, setAddonType] = useState(1);
    const [adminName, setAdminName] = useState('');
    const [options, setOptions] = useState([
        {
            namePl: '',
            nameEn: '',
            image: null,
            color: '',
            oldImage: ''
        }
    ]);
    const [colorModal, setColorModal] = useState(false);
    const [currentOption, setCurrentOption] = useState(-1);
    const [status, setStatus] = useState(0);
    const [mainImage, setMainImage] = useState(null);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [oldMainImage, setOldMainImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);

    const inputRef = useRef(null);

    const addNewOption = () => {
        setOptions([...options, {
            namePl: '',
            nameEn: '',
            image: null,
            color: '',
            oldImage: '',
            tooltipPl: '',
            tooltipEn: '',
            adminName: ''
        }]);
    }

    const updateOptions = (i, input, e) => {
        setOptions(options?.map((item, index) => {
            if(i === index) {
                item[input] = e.target.value;
                return item;
            }
            else {
                return item;
            }
        }));
    }

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        const fileUrl = window.URL.createObjectURL(file);
        setOldMainImage(null);
        setMainImageFile(file);
        setMainImage(fileUrl);
    }

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');

        if(id) {
            setUpdateMode(true);
            getAddonById(id)
                .then((res) => {
                    if(res?.status === 200) {
                        const result = res?.data?.result[0];
                        if(result) {
                            setId(result.id);
                            setNamePl(result.name_pl ? result.name_pl : '');
                            setNameEn(result.name_en ? result.name_en : '');
                            setInfoPl(result.info_pl ? result.info_pl : '');
                            setInfoEn(result.info_en ? result.info_en : '');
                            setTooltipPl(result.tooltip_pl ? result.tooltip_pl : '');
                            setTooltipEn(result.tooltip_en ? result.tooltip_en : '');
                            setOldMainImage(result.image);
                            setAddonType(result.addon_type);
                            setAdminName(result.admin_name ? result.admin_name : '');

                            const addonTypeToUpdate = result.addon_type;

                            getOptionsByAddon(result.id)
                                .then((res) => {
                                    if(res.status === 200) {
                                        const result = res?.data?.result;
                                        if(result) {
                                            setOptions(result?.map((item, index, array) => {
                                                return {
                                                    namePl: item.name_pl,
                                                    nameEn: item.name_en,
                                                    image: null,
                                                    color: addonTypeToUpdate === 3 ? item.image : '',
                                                    oldImage: addonTypeToUpdate === 2 ? item.image : null,
                                                    tooltipPl: item.tooltip_pl,
                                                    tooltipEn: item.tooltip_en,
                                                    adminName: item.admin_name
                                                }
                                            }));
                                        }
                                    }
                                })
                                .catch((err) => {
                                    window.location = '/panel';
                                })
                        }
                        else {
                            window.location = '/panel';
                        }
                    }
                })
                .catch(() => {
                    window.location = '/';
                });
        }
    }, []);

    useEffect(() => {
        if(status) {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        if(currentOption !== -1) {
            setColorModal(true);
        }
    }, [currentOption]);

    useEffect(() => {
        if(!colorModal) {
            setCurrentOption(-1);
        }
    }, [colorModal]);

    const deleteImgFromAddon = (i) => {
        setOptions(options?.map((item, index) => {
            if(i === index) {
                if(item?.image) {
                    item.image?.remove();
                }
                item.oldImage = null;
                item.image = null;
                return item;
            }
            else {
                return item;
            }
        }));
    }

    const changeCurrentOptionColor = (color, event) => {
        setOptions(options?.map((item, index) => {
            if(index === currentOption) {
                item.color = color.hex;
            }
            return item;
        }));
    }

    const deleteAddonOption = (i) => {
        setOptions(options?.filter((item, index) => {
            return index !== i;
        }));
    }

    const createAddonOptions = async (insertedId = null) => {
        for(let i=0; i<options.length; i++) {
            const item = options[i];
            await addAddonOption(insertedId ? insertedId : id,
                item.namePl, item.nameEn,
                addonType === 3 ? item.color : null,
                addonType === 2 ? item.image?.file : null,
                item.oldImage, item.tooltipPl, item.tooltipEn, item.adminName)
                .then((res) => {
                    if(res.status === 201) {
                        if(i === options.length-1) {
                            setStatus(1);
                            scrollToTop();
                        }
                    }
                    else {
                        setStatus(-2);
                        scrollToTop();
                    }
                })
                .catch(() => {
                    setStatus(-2);
                    scrollToTop();
                });
        }
    }

    const validateOptions = () => {
        return options.findIndex((item) => {
            return !item.namePl || !item.nameEn;
        }) === -1;
    }

    const createNewAddon = () => {
        if(addonType && namePl && nameEn && validateOptions() && adminName) {
            setLoading(true);

            if(updateMode) {
                deleteAddonOptions(id)
                    .then((res) => {
                        if(res?.status === 201) {
                            updateAddon(id, namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, mainImageFile, addonType, adminName)
                                .then((res) => {
                                    if(res?.status === 201) {
                                        createAddonOptions();
                                    }
                                    else {
                                        setStatus(-2);
                                        scrollToTop();
                                    }
                                })
                                .catch(() => {
                                    setStatus(-2);
                                    scrollToTop();
                                });
                        }
                        else {
                            setStatus(-2);
                            scrollToTop();
                        }
                    })
                    .catch(() => {
                        setStatus(-2);
                        scrollToTop();
                    });
            }
            else {
                addAddon(namePl, nameEn, infoPl, infoEn, tooltipPl, tooltipEn, mainImageFile, addonType, adminName)
                    .then((res) => {
                        if(res.status === 201) {
                            const id = res?.data?.result;
                            if(id) {
                                createAddonOptions(id);
                            }
                            else {
                                setStatus(-2);
                                scrollToTop();
                            }
                        }
                        else {
                            setStatus(-2);
                            scrollToTop();
                        }
                    })
                    .catch(() => {
                        setStatus(-2);
                        scrollToTop();
                    });
            }
        }
        else {
            setStatus(-1);
            scrollToTop();
        }
    }

    const getUploadImage = (img) => {
        console.log(img);
    }

    const handleChangeStatus = (i, status) => {
        setOptions(options?.map((item, index) => {
            if(i === index) {
                if(status.remove) item.image = status;
                return item;
            }
            else {
                return item;
            }
        }))
    }

    useEffect(() => {
        if(options?.length) {
            const allOptionsImgLabels = Array.from(document.querySelectorAll('.admin__label__imgUpload'));
            const imagesPlaceholders = Array.from(document.querySelectorAll('.admin__label__imgUpload__placeholder'));
            if(allOptionsImgLabels.length === options.length && allOptionsImgLabels.length === imagesPlaceholders.length) {
                options.forEach((item, index) => {
                    if(item.oldImage || item.image) {
                        imagesPlaceholders[index].style.visibility = 'hidden';
                        allOptionsImgLabels[index].style.height = 'auto';
                    }
                    else if(addonType === 2) {
                        imagesPlaceholders[index].style.visibility = 'visible';
                        allOptionsImgLabels[index].style.height = '200px';
                    }
                });
            }
            else {
                if(addonType === 1 || addonType === 3) {
                    const spans = Array.from(document.querySelectorAll('.admin__label>.hidden'));
                    spans.forEach((item) => {
                        item.style.height = '0';
                    })
                }
            }
        }
    }, [options, addonType]);

    return <div className="container container--admin container--addProduct container--addAddon">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={2} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj dodatek
                </h2>
                {status ? <span className="admin__status">
                        {status !== 1 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -2) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Dodatek został zaktualizowany' : 'Dodatek został dodany'}
                        </span>}
                </span> : ""}

                <label>
                    Nazwa robocza dodatku *
                    <input className="input"
                           placeholder="Nazwa robocza"
                           value={adminName}
                           onChange={(e) => { setAdminName(e.target.value); }} />
                </label>
                <label>
                    Nazwa wyświetlana dodatku (polski) *
                    <input className="input"
                           placeholder="Polska nazwa dodatku"
                           value={namePl}
                           onChange={(e) => { setNamePl(e.target.value); }} />
                </label>
                <label>
                    Nazwa wyświetlana dodatku (angielski) *
                    <input className="input"
                           placeholder="Angielska nazwa dodatku"
                           value={nameEn}
                           onChange={(e) => { setNameEn(e.target.value); }} />
                </label>
                <label>
                    Dodatkowe info (polski)
                    <textarea className="input input--textarea"
                           placeholder="Informacja po polsku"
                           value={infoPl}
                           onChange={(e) => { setInfoPl(e.target.value); }} />
                </label>
                <label>
                    Dodatkowe info (angielski)
                    <textarea className="input input--textarea"
                              placeholder="Informacja po angielsku"
                              value={infoEn}
                              onChange={(e) => { setInfoEn(e.target.value); }} />
                </label>
                {/*<label>*/}
                {/*    Tekst kursywą pod opcjami dodatku (polski)*/}
                {/*    <textarea className="input input--textarea"*/}
                {/*              placeholder="Tekst kursywą pod opcjami dodatku (polski)"*/}
                {/*              value={tooltipPl}*/}
                {/*              onChange={(e) => { setTooltipPl(e.target.value); }} />*/}
                {/*</label>*/}
                {/*<label>*/}
                {/*    Tekst kursywą pod opcjami dodatku (angielski)*/}
                {/*    <textarea className="input input--textarea"*/}
                {/*              placeholder="Tekst kursywą pod opcjami dodatku (angielski)"*/}
                {/*              value={tooltipEn}*/}
                {/*              onChange={(e) => { setTooltipEn(e.target.value); }} />*/}
                {/*</label>*/}

                {/*<h3 className="addAddon--imageHeader">*/}
                {/*    Zdjęcie po najechaniu myszką*/}
                {/*</h3>*/}
                {/*<div className="uploadGalleryWrapper">*/}
                {/*    <div className="editor__mainImageWrapper">*/}
                {/*        {oldMainImage ? <div className="oldImgWrapper z-index-1000">*/}
                {/*                <button className="deleteOldImg" onClick={() => { setOldMainImage(null); }}>*/}
                {/*                    &times;*/}
                {/*                </button>*/}
                {/*                <img className="editor__video" src={`${settings.API_URL}/image?url=/media/addons/${oldMainImage}`} alt="placeholder" />*/}
                {/*            </div>*/}
                {/*            : <div className="oldImgWrapper z-index-0">*/}
                {/*                {mainImage ? <button className="deleteOldImg" onClick={() => { setOldMainImage(null); setMainImageFile(null); setMainImage(null); }}>*/}
                {/*                    &times;*/}
                {/*                </button> : ''}*/}
                {/*                <img className={mainImage ? "editor__video" : "editor__video opacity-0"} src={mainImage} alt="placeholder" />*/}
                {/*            </div>}*/}

                {/*        {!mainImage ? <span className="editor__mainImage__placeholder">*/}
                {/*                <input type="file" className="editor__files__input" ref={inputRef} multiple={false}*/}
                {/*                       onChange={(e) => { handleMainImageUpload(e); }} />*/}
                {/*               <div className="editor__videoWrapper__placeholderContent">*/}
                {/*                    <p className="editor__videoWrapper__placeholderContent__text">*/}
                {/*                        Kliknij tutaj lub upuść plik aby dodać zdjęcie*/}
                {/*                    </p>*/}
                {/*                    <img className="editor__videoWrapper__icon" src={imageIcon} alt="video" />*/}
                {/*            </div>*/}
                {/*        </span> : <input type="file" className="editor__files__input" ref={inputRef} multiple={false}*/}
                {/*                         onChange={(e) => { handleMainImageUpload(e); }} />}*/}
                {/*    </div>*/}
                {/*</div>*/}

                <label>
                    Typ dodatku (co będzie wybierał klient)
                    <span className="flex flex--addonType">
                        <button className={addonType === 1 ? "btn btn--choose btn--choose--selected" : "btn btn--choose"}
                            onClick={() => { setAddonType(1); }}>
                            Tekst
                        </button>
                        <button className={addonType === 2 ? "btn btn--choose btn--choose--selected" : "btn btn--choose"}
                                onClick={() => { setAddonType(2); }}>
                            Tekst + zdjęcie
                        </button>
                    </span>
                </label>

                <header className="flex optionsHeader">
                    <h3 className="admin__main__header">
                        Opcje do wyboru
                    </h3>
                    <button className="btn btn--addOption" onClick={() => { addNewOption(); }}>
                        +
                    </button>
                </header>

                {options?.map((item, index) => {
                    return <div className="singleOption">
                        <div className="singleOption__top">
                            <span className="singleOption__number">
                                {index+1}
                            </span>
                            <button className="btn btn--addOption" onClick={() => { deleteAddonOption(index); }}>
                                &times;
                            </button>
                        </div>
                        <label>
                            Nazwa robocza
                            <input className="input"
                                   placeholder="Nazwa robocza"
                                   value={item.adminName}
                                   onChange={(e) => { updateOptions(index, 'adminName', e); }} />
                        </label>
                        <label>
                            Nazwa wyświetlana (polski)
                            <input className="input"
                                   placeholder="Polska nazwa opcji"
                                   value={item.namePl}
                                   onChange={(e) => { updateOptions(index, 'namePl', e); }} />
                        </label>
                        <label>
                            Szczegóły po najechaniu (polski)
                            <input className="input"
                                   placeholder="Polskie szczegóły (po najechaniu)"
                                   value={item.tooltipPl}
                                   onChange={(e) => { updateOptions(index, 'tooltipPl', e); }} />
                        </label>
                        <label>
                            Nazwa wyświetlana (angielski)
                            <input className="input"
                                   placeholder="Angielska nazwa opcji"
                                   value={item.nameEn}
                                   onChange={(e) => { updateOptions(index, 'nameEn', e); }} />
                        </label>
                        <label>
                            Szczegóły po najechaniu (angielski)
                            <input className="input"
                                   placeholder="Angielskie szczegóły (po najechaniu)"
                                   value={item.tooltipEn}
                                   onChange={(e) => { updateOptions(index, 'tooltipEn', e); }} />
                        </label>

                        <div className={addonType === 1 || addonType === 0 ? 'd-none--margin' : "admin__label admin__flex"}>
                            {addonType === 3 ? 'Kolor' : (addonType === 2 ? 'Zdjęcie' : '')}
                            <span className={addonType !== 3 ? 'hidden' : "admin__label__color flex"}>
                                <button className={addonType === 3 ? "btn btn--openColorModal" : 'd-none'} onClick={(e) => { e.stopPropagation(); e.preventDefault(); setCurrentOption(index); }}>
                                    Zmień kolor
                                </button>
                                <span className="showColor" style={{
                                    background: item.color
                                }}>
                                </span>
                            </span>

                            <span className={addonType !== 2 ? 'hidden' : "admin__label__imgUpload"}>
                                {/* Image placeholder */}
                                <span className="admin__label__imgUpload__placeholder">
                                    <img className="img" src={imageIcon} alt="image" />
                                    Przeciągnij zdjęcie lub kliknij aby dodać je do danej opcji
                                </span>

                                {/* Delete image button */}
                                {item.image || item.oldImage ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImgFromAddon(index); }}>
                                    &times;
                                </button> : ""}
                                {/* File dropzone */}
                                {!item.oldImage ? <Dropzone
                                    canRemove={true}
                                    getUploadParams={getUploadImage}
                                    onChangeStatus={(status) => { handleChangeStatus(index, status); }}
                                    accept="image/*"
                                    PreviewComponent={ImagePreview}
                                    multiple={false}
                                    maxFiles={1} /> : ''}
                                {/* Old image preview */}
                                {item.oldImage ? <div className="admin__label__oldImagePreviewWrapper">
                                    <img className="img" src={`${settings.API_URL}/image?url=/media/addons/${item.oldImage}`} alt="img" />
                                </div> : ''}
                            </span>
                        </div>
                    </div>
                })}

                {colorModal ? <ColorModal color={options[currentOption].color}
                                          closeModalFunction={() => { setColorModal(false); }}
                                          onChange={changeCurrentOptionColor}
                /> : ""}

                {!loading ? <button className="btn btn--admin" onClick={() => { createNewAddon(); }}>
                    {updateMode ? "Zaktualizuj dodatek" : "Dodaj dodatek"}
                </button> : <Waiting />}
            </main>
        </div>
    </div>
};

export default AddAddon;
