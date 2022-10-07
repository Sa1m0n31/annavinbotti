import React, {useEffect, useRef, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';
import {
    addAddonsForProduct,
    addProduct, deleteAddonsForProduct,
    getAddonsByProduct,
    getAllAddons, getAllAddonsOptions,
    getAllTypes, getOptionsByAddon,
    getProductDetails,
    getProductGallery, updateProduct
} from "../../helpers/products";
import RUG from 'react-upload-gallery'
import settings from "../../static/settings";
import imageIcon from '../../static/img/image-gallery.svg'
import Waiting from "../../components/admin/Loader";
import {createSlug, scrollToTop} from "../../helpers/others";
import draftToHtml from "draftjs-to-html";

const AddProduct = () => {
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [descriptionPl, setDescriptionPl] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [detailsPl, setDetailsPl] = useState("");
    const [detailsEn, setDetailsEn] = useState("");
    const [price, setPrice] = useState(null);
    const [addons, setAddons] = useState([]);
    const [addonsOptions, setAddonsOptions] = useState([]);
    const [optionsByAddon, setOptionsByAddon] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(-1);
    const [mainImage, setMainImage] = useState(null);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [oldMainImage, setOldMainImage] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [updateMode, setUpdateMode] = useState(false);
    const [status, setStatus] = useState(0);
    const [initialGallery, setInitialGallery] = useState([]);
    const [galleryLoaded, setGalleryLoaded] = useState(false);
    const [id, setId] = useState(-1);
    const [showOnHomepage, setShowOnHomepage] = useState(false);
    const [priority, setPriority] = useState(0);
    const [currentAddonOptions, setCurrentAddonOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateDefaultAddonOption, setUpdateDefaultAddonOption] = useState(-1);
    const [addonsData, setAddonsData] = useState([]);

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        const fileUrl = window.URL.createObjectURL(file);
        setOldMainImage(null);
        setMainImageFile(file);
        setMainImage(fileUrl);
    }

    useEffect(() => {
        const idParam = new URLSearchParams(window.location.search).get('id');

        getAllTypes()
            .then((res) => {
                setTypes(res?.data?.result);
            });

        if(idParam) {
            setUpdateMode(true);
            setId(parseInt(idParam));

            getProductDetails(idParam)
                .then((res) => {
                    const r = res?.data?.result[0];
                    if(r) {
                        setNamePl(r.name_pl);
                        setNameEn(r.name_en);
                        setPrice(r.price);
                        setOldMainImage(r.main_image);
                        setSelectedType(r.type);
                        setPriority(r.priority);
                        setShowOnHomepage(r.show_on_homepage);

                        if(r.description_pl) {
                            setDescriptionPl(EditorState.createWithContent(convertFromRaw(JSON.parse(r.description_pl))));
                        }
                        if(r.description_en) {
                            setDescriptionEn(EditorState.createWithContent(convertFromRaw(JSON.parse(r.description_en))));
                        }
                        if(r.details_pl) {
                            setDetailsPl(EditorState.createWithContent(convertFromRaw(JSON.parse(r.details_pl))));
                        }
                        if(r.details_en) {
                            setDetailsEn(EditorState.createWithContent(convertFromRaw(JSON.parse(r.details_en))));
                        }

                        getProductGallery(idParam)
                            .then((res) => {
                                setInitialGallery(res?.data?.result?.map((item) => {
                                    return {
                                        source: `${settings.API_URL}/image?url=/media/products/${item.path}`,
                                        name: item.path
                                    }
                                }));
                            })
                    }
                });

            getAllAddons()
                .then((res) => {
                    if(res?.status === 200) {
                        const addonsLocal = res?.data?.result;
                        console.log(addonsLocal);
                        setAddonsData(addonsLocal);
                        setAddons(addonsLocal?.sort((a, b) => (a.admin_name > b.admin_name ? 1 : -1)));

                        getAllAddonsOptions()
                            .then((res) => {
                                const allOptions = res?.data?.result;
                                if(allOptions) {
                                    const firstAddonOption = allOptions[0]?.id;
                                    const firstAddon = allOptions[0].addon;

                                    setAddonsOptions(allOptions);

                                    const getOptionsByAddonId = (ad) => {
                                        return allOptions?.filter((item) => {
                                            return item.addon === ad;
                                        });
                                    }

                                    const firstOptions = allOptions.filter((item) => {
                                        return item.addon === firstAddon;
                                    });

                                    if(firstAddonOption) {

                                        getAddonsByProduct(idParam)
                                            .then((res) => {
                                                const addonsForProduct = res?.data?.result;

                                                const getAddonConditionInfo = (i) => {
                                                    return addonsForProduct?.find((item) => {
                                                        return item.id === i;
                                                    });
                                                }

                                                setAddons(addonsLocal?.map((item) => {
                                                    const currentAddonConditionInfo = getAddonConditionInfo(item.id);

                                                    return {
                                                        id: item.id,
                                                        active: !!currentAddonConditionInfo,
                                                        name: item.name_pl,
                                                        adminName: item.admin_name,
                                                        conditionActive: !!currentAddonConditionInfo && currentAddonConditionInfo?.is_equal !== null,
                                                        conditionIf: currentAddonConditionInfo?.show_if ? currentAddonConditionInfo?.show_if : addonsLocal[0]?.id,
                                                        conditionThen: currentAddonConditionInfo?.is_equal ? currentAddonConditionInfo?.is_equal : firstAddonOption,
                                                        priority: currentAddonConditionInfo?.priority ? currentAddonConditionInfo?.priority : null
                                                    }
                                                })?.sort((a, b) => (a.adminName > b.adminName ? 1 : -1)));

                                                setCurrentAddonOptions(addonsLocal?.map((item) => {
                                                    const currentAddonConditionInfo = getAddonConditionInfo(item.id);

                                                    return currentAddonConditionInfo?.show_if ? getOptionsByAddonId(currentAddonConditionInfo.show_if) : firstOptions
                                                }));
                                            });
                                    }
                                }
                            });
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
        else {
            /* NEW PRODUCT */
            setGalleryLoaded(true);
            getAllAddons()
                .then((res) => {
                    if(res?.status === 200) {
                        const addonsLocal = res?.data?.result;
                        setAddonsData(addonsLocal);

                        getAllAddonsOptions()
                            .then((res) => {
                                const r = res?.data?.result;
                                if(r) {
                                    const firstAddonOption = r[0]?.id;
                                    const firstAddon = r[0].addon;

                                    setAddonsOptions(r);

                                    const firstOptions = r.filter((item) => {
                                        return item.addon === firstAddon;
                                    });

                                    if(firstAddonOption) {
                                        setAddons(addonsLocal?.map((item) => {
                                            return {
                                                id: item.id,
                                                active: false,
                                                name: item.name_pl,
                                                adminName: item.admin_name,
                                                conditionActive: false,
                                                conditionIf: addonsLocal[0]?.id,
                                                conditionThen: firstAddonOption,
                                                priority: null
                                            }
                                        })?.sort((a, b) => (a.adminName > b.adminName ? 1 : -1)));
                                        setCurrentAddonOptions(addonsLocal?.map((item) => {
                                            return firstOptions;
                                        }));
                                    }
                                }
                            })
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
    }, []);

    useEffect(() => {
        if(addonsOptions?.length) {
            const optionsByAddonLocal = {};
            addonsOptions.forEach((item) => {
                const addonId = item.addon;
                const optionName = item.name_pl;
                optionsByAddonLocal[addonId] = optionsByAddonLocal[addonId]?.concat([optionName]) || [optionName];
            });
            setOptionsByAddon(optionsByAddonLocal);
        }
    }, [addonsOptions]);

    useEffect(() => {
        if(initialGallery?.length) {
            setGalleryLoaded(true);
        }
    }, [initialGallery]);

    useEffect(() => {
        if(status) {
            setLoading(false);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [status]);

    const toggleCondition = (i) => {
        setAddons(addons?.map((item, index) => {
            if(index === i) return {...item, conditionActive: !item?.conditionActive}
            else return item;
        }));
    }

    const updateSelectedAddons = (i) => {
        setAddons(addons?.map((item, index) => {
            return index === i ? {...item, active: !item.active} : item;
        }));
    }

    const getAddonOptions = (addonIndex, addonId) => {
        getOptionsByAddon(addonId)
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    setCurrentAddonOptions(currentAddonOptions?.map((item, index) => {
                        if(index === addonIndex) {
                            return result;
                        }
                        else {
                            return item;
                        }
                    }))
                }
            });
    }

    useEffect(() => {
        if(updateDefaultAddonOption >= 0) {
            setAddons(prevState => prevState.map((item, index) => {
                if(updateDefaultAddonOption === index) {
                    return {...item, conditionThen: currentAddonOptions[index][0]}
                }
                else {
                    return item;
                }
            }))
        }
    }, [updateDefaultAddonOption]);

    const getFirstOptionByAddon = (ad) => {
        return addonsOptions.find((item) => {
            return item.addon === parseInt(ad);
        }).id;
    }

    const updateAddons = (i, property, value) => {
       setAddons(addons?.map((item, index) => {
            if(index === i) {
                if(property === 'conditionIf') {
                    getAddonOptions(i, value);
                    return {
                        ...item,
                        conditionIf: value,
                        conditionThen: getFirstOptionByAddon(value)
                    };
                }
                else if(property === 'conditionThen') {
                    return {...item, conditionThen: value};
                }
                else if(property === 'priority') {
                    return {...item, priority: value}
                }
                else {
                    return item;
                }
            }
            else {
                return item;
            }
        }));
    }

    const addAddonsForProductWrapper = (productId) => {
        addAddonsForProduct(productId, addons?.filter((item) => {
            return item.active;
        })?.map((item) => ({
            addon: item.id,
            ifAddon: item.conditionActive ? item.conditionIf : null,
            isEqual: item.conditionActive ? item.conditionThen : null,
            priority: item.priority
        })))
            .then((res) => {
                if(res?.status === 201) {
                    setStatus(1);
                }
                else {
                    setStatus(-2);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setStatus(-2);
            });
    }

    const handleProductSubmit = (formData) => {
        if(updateMode) {
            updateProduct(formData, id, mainImageFile, namePl, nameEn, descriptionPl, descriptionEn,
                detailsPl, detailsEn, price, selectedType, showOnHomepage, priority)
                .then((res) => {
                    deleteAddonsForProduct(id)
                        .then((res) => {
                            if(res) {
                                addAddonsForProductWrapper(id);
                            }
                            else {
                                setStatus(-2);
                                setLoading(false);
                            }
                        })
                        .catch(() => {
                            setStatus(-2);
                            setLoading(false);
                        });
                })
                .catch((err) => {
                    setStatus(-2);
                    setLoading(false);
                });
        }
        else {
            addProduct(formData, mainImageFile, namePl, nameEn, descriptionPl, descriptionEn,
                detailsPl, detailsEn, price, selectedType, showOnHomepage, priority)
                .then((res) => {
                    const productId = res?.data?.result;
                    if(productId) {
                        addAddonsForProductWrapper(productId);
                    }
                    else {
                        setLoading(false);
                        setStatus(-2);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setStatus(-2);
                });
        }
    }

    const createNewProduct = () => {
        setLoading(true);
        if(namePl && namePl && price && (selectedType !== -1) && (oldMainImage || mainImage) && gallery?.length) {
            let handleProductSubmitInvoked = false;
            let formData = new FormData();
            for(let i=0; i<gallery.length; i++) {
                const item = gallery[i];
                let xhr = new XMLHttpRequest();
                xhr.open('GET', item.source, true);
                xhr.responseType = 'blob';
                xhr.onload = async function(e) {
                    if(this.status == 200) {
                        let myBlob = this.response;
                        new Promise((resolve, reject) => {
                            formData.append('gallery', new File([myBlob], 'name'));
                            resolve();
                        })
                            .then(() => {
                                if(i === gallery.length-1) {
                                    setTimeout(() => {
                                        handleProductSubmit(formData);
                                    }, 500);
                                }
                            });

                    }
                    else {
                        if(!handleProductSubmitInvoked) {
                            handleProductSubmitInvoked = true;
                            setTimeout(() => {
                                handleProductSubmit(formData);
                            }, 500);
                        }
                    }
                };
                xhr.send();
            }
        }
        else {
            setStatus(-1);
            setLoading(false);
            scrollToTop();
        }
    }

    const showPreview = () => {
        if(updateMode) {
            window.open(`${settings.WEBSITE_URL}/produkt/${createSlug(namePl)}`, '_blank');
        }
        else {
            const addonsObject = addons.filter((item) => (item.active)).map((item) => {
                const addonId = item.id;
                const { conditionActive, priority, conditionIf, conditionThen } = item;

                return [
                    item.name,
                    addonsOptions
                        .filter((item) => (item.addon === addonId))
                        .map((item) => {
                            const currentAddonData = addonsData.find((item) => (item.id === addonId));

                            return {
                                ...item,
                                id: addonId,
                                addon_name_pl: currentAddonData.name_pl,
                                addon_name_en: currentAddonData.name_pl,
                                addon_option_id: item.id,
                                priority: parseInt(priority),
                                addon_option_name_pl: item.name_pl,
                                addon_option_name_en: item.name_en,
                                show_if: conditionActive ? parseInt(conditionIf) : null,
                                is_equal: conditionActive ? parseInt(conditionThen) : null,
                                addon_type: currentAddonData.addon_type,
                                info_pl: currentAddonData.info_pl,
                                info_en: currentAddonData.info_en
                            }
                        })
                ]
            });

            const galleryArray = gallery.map((item) => {
                return window.URL.createObjectURL(item.file);
            });

            const productObject = {
                namePl,
                price,
                descriptionPl: draftToHtml(JSON.parse(JSON.stringify(convertToRaw(descriptionPl?.getCurrentContent())))),
                detailsPl: draftToHtml(JSON.parse(JSON.stringify(convertToRaw(detailsPl?.getCurrentContent())))),
                addons: addonsObject,
                mainImage,
                gallery: galleryArray
            }

            localStorage.setItem('productObject', JSON.stringify(productObject));

            window.open(`${settings.WEBSITE_URL}/podglad-produktu`, '_blank');
        }
    }

    return <div ref={containerRef} className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={1} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj model
                </h2>
                {status ? <span className="admin__status">
                        {status === -1 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -2) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Model został zaktualizowany' : 'Model został dodany'}
                        </span>}
                </span> : ""}

                    <label>
                        Nazwa modelu (polski) *
                        <input className="input"
                               placeholder="Polska nazwa modelu"
                               value={namePl}
                               onChange={(e) => { setNamePl(e.target.value); }} />
                    </label>
                    <label>
                        Nazwa modelu (angielski) *
                        <input className="input"
                               placeholder="Angielska nazwa modelu"
                               value={nameEn}
                               onChange={(e) => { setNameEn(e.target.value); }} />
                    </label>
                    <label>
                        Cena *
                        <input className="input input--100"
                               placeholder="Cena modelu"
                               type="number"
                               step={0.01}
                               value={price}
                               onChange={(e) => { setPrice(e.target.value); }} />
                    </label>
                    <label>
                        Opis modelu (polski)
                        <Editor
                            editorState={descriptionPl}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescriptionPl(text); }}
                        />
                    </label>
                    <label>
                        Opis modelu (angielski)
                        <Editor
                            editorState={descriptionEn}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDescriptionEn(text); }}
                        />
                    </label>
                    <label>
                        Szczegóły modelu (polski)
                        <Editor
                            editorState={detailsPl}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDetailsPl(text); }}
                        />
                    </label>
                    <label>
                        Szczegóły modelu (angielski)
                        <Editor
                            editorState={detailsEn}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editor"
                            onEditorStateChange={(text) => { setDetailsEn(text); }}
                        />
                    </label>
                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header addProduct__addonsSection__header--addons">
                        Wybierz dodatki do wyboru dla klienta
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        {addons?.map((item, index) => {
                            return <div className="addProduct__addonsSection__main__itemWrapper">
                                <div className="addProduct__addonsSection__main__item flex">
                                    <label className="addProduct__addonsSection__labelForInput">
                                        Kolejność:
                                        <input className="addProduct__addonsSection__input"
                                               value={item.priority}
                                               onChange={(e) => { updateAddons(index, 'priority', e.target.value); }}
                                               type="number" />
                                    </label>
                                    <label className="addProduct__addonsSection__label">
                                        <button className={item?.active ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                                onClick={() => { updateSelectedAddons(index); }}>

                                        </button>
                                        <span>
                                            {item.adminName} <span className="admin__value--small">({item.name})</span>
                                        </span>
                                    </label>

                                    <button className="addProduct__addonsSection__addCondition" onClick={() => { toggleCondition(index); }}>
                                        {item?.conditionActive ? 'Usuń warunek' : 'Dodaj warunek'}
                                    </button>
                                </div>

                                <div className="addProduct__addonsSection__addonOptions">
                                    <i>
                                        Opcje:
                                    </i>
                                    {optionsByAddon[item.id]?.map((item, index, array) => {
                                        return <span>
                                            {item}{index === array.length - 1 ? '' : ','}
                                        </span>
                                    })}
                                </div>

                                {item?.conditionActive ? <div className="addProduct__addonsSection__condition">
                                    Pokazuj ten dodatek jeśli dodatek:
                                    <span className="space"></span>
                                    <label>
                                        <select value={item?.conditionIf}
                                                onChange={(e) => { updateAddons(index, 'conditionIf', e.target.value); }}>
                                            {addons?.map((itemChild, index) => {
                                                return <option key={index} value={itemChild.id} disabled={item.id === itemChild.id}>
                                                    {itemChild.name}
                                                </option>
                                            })}
                                        </select>
                                    </label>
                                    <span className="space"></span>
                                    jest równy:
                                    <span className="space"></span>
                                    <label>
                                        <select value={item?.conditionThen}
                                                onChange={(e) => { updateAddons(index, 'conditionThen', e.target.value); }}>
                                            {currentAddonOptions[index]?.map((item, index) => {
                                                return <option key={index}
                                                               value={item.id}>
                                                    {item.name_pl}
                                                </option>
                                            })}
                                        </select>
                                    </label>
                                </div> : ''}
                            </div>
                        })}
                    </div>
                </div>

                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Wybierz typ obuwia *
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        {types?.map((item, index) => {
                            return <label className="addProduct__addonsSection__label">
                                <button className={selectedType === item.id ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                        onClick={() => { setSelectedType(item.id); }}>

                                </button>
                                <span>
                                    {item.name_pl}
                                </span>
                            </label>
                        })}
                    </div>
                </div>

                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Wyświetlanie
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        <label className="addProduct__addonsSection__label">
                            <button className={showOnHomepage ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                    onClick={() => { setShowOnHomepage(!showOnHomepage); }}>

                            </button>
                            <span>
                                Wyświetlaj na stronie głównej w zakładce Nasze Modele
                            </span>
                        </label>
                        <label className="label">
                            <span>
                                Priorytet (im większa liczba, tym produkt będzie wyświetlał się wyżej)
                            </span>
                            <input className="input input--priority"
                                   value={priority}
                                   onChange={(e) => { setPriority(e.target.value); }}
                                   type="number" />
                        </label>
                    </div>
                </div>

                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Dodaj zdjęcie wyróżniające *
                    </h3>
                    <div className="uploadGalleryWrapper">
                        <div className="editor__mainImageWrapper">
                            {oldMainImage ? <div className="oldImgWrapper z-index-1000">
                                    <button className="deleteOldImg" onClick={() => { setOldMainImage(null); }}>
                                        &times;
                                    </button>
                                    <img className="editor__video" src={`${settings.API_URL}/image?url=/media/products/${oldMainImage}`} alt="placeholder" />
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

                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Dodaj galerię zdjęć *
                    </h3>
                    <div className="uploadGalleryWrapper">
                        {galleryLoaded ? <RUG
                            onChange={(images) => {
                                setGallery(images);
                            }}
                            autoUpload={false}
                            sorting={true}
                            initialState={initialGallery}
                            source={response => response.source} // response image source
                        /> : ''}
                    </div>
                </div>


                {loading ? <Waiting /> : <div>
                    <button className="btn btn--admin btn--preview" onClick={() => { showPreview(); }}>
                        Podgląd produktu
                    </button>
                    <button className="btn btn--admin" onClick={() => { createNewProduct(); }}>
                        {updateMode ? "Aktualizuj produkt" : "Dodaj produkt"}
                    </button>
                </div>}
            </main>
        </div>
    </div>
};

export default AddProduct;
