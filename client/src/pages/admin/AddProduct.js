import React, {useEffect, useRef, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import {
    addAddonsConditionsForProduct,
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
    const [conditions, setConditions] = useState([]);
    const [currentAddonOptions, setCurrentAddonOptions] = useState([]);

    const inputRef = useRef(null);

    const isElementInArray = (el, arr) => {
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }

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
            })
            .catch((err) => {
                console.log(err);
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
                        setAddons(addonsLocal);

                        getAllAddonsOptions()
                            .then((res) => {
                                const allOptions = res?.data?.result;
                                if(allOptions) {

                                    getAddonsByProduct(idParam)
                                        .then((res) => {
                                            const result = res?.data?.result;
                                            const idArray = result?.map((item) => {
                                                return item.id;
                                            });

                                            if(result) {
                                                setSelectedAddons(addonsLocal?.map((item) => {
                                                    return isElementInArray(item.id, idArray);
                                                }));
                                                
                                                const conditionsLocal = addonsLocal?.map((item) => {
                                                    return {
                                                        active: isElementInArray(item.id, result?.filter((item) => {
                                                            return item.show_if;
                                                        })?.map((item) => {
                                                            return item.id;
                                                        })),
                                                        ifAddon: result?.find((itemChild) => {
                                                            return item.id === itemChild.id;
                                                        })?.show_if,
                                                        isEqual: result?.find((itemChild) => {
                                                            return item.id === itemChild.id;
                                                        })?.is_equal,
                                                        thenShow: item.id
                                                    }
                                                });

                                                if(result.length) {
                                                    setConditions(conditionsLocal);
                                                    setCurrentAddonOptions(conditionsLocal?.map((item) => {
                                                        return getAddonOptionsFromOptionsList(item.ifAddon);
                                                    }));
                                                }
                                                else {
                                                   setConditions(conditionsLocal?.map((item) => {
                                                       return {...item, ifAddon: null, isEqual: null};
                                                   }));
                                                   getOptionsWrapper(addonsLocal);
                                                }

                                                const smallestId = (el) => {
                                                    return allOptions.filter((item) => {
                                                        return el.id <= item.id
                                                    })?.length >= 1;
                                                }

                                                const getAddonOptionsFromOptionsList = (addonId) => {
                                                    if(addonId) {
                                                        return allOptions.filter((item) => {
                                                            return item.addon_id === addonId;
                                                        })?.map((item) => {
                                                            return {...item, name_pl: item.addon_option_name}
                                                        });
                                                    }
                                                    else {
                                                        return allOptions.filter((item) => {
                                                            return smallestId(item);
                                                        }).map((item) => {
                                                            return {...item, name_pl: item.addon_option_name}
                                                        });
                                                    }
                                                }
                                            }
                                            else {
                                                setConditions(addonsLocal.map((item) => ({
                                                    active: false,
                                                    ifAddon: null,
                                                    isEqual: null,
                                                    thenShow: item.id
                                                })));
                                            }
                                        });
                                }
                            });
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
        else {
            setGalleryLoaded(true);
            getAllAddons()
                .then((res) => {
                    if(res?.status === 200) {
                        const addonsLocal = res?.data?.result;
                        setAddons(addonsLocal);
                        setConditions(addonsLocal?.map((item) => ({
                            active: false,
                            ifAddon: null,
                            isEqual: null,
                            thenShow: item.id
                        })));
                        setSelectedAddons(addonsLocal?.map((item) => {
                            return false;
                        }));
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
    }, []);

    useEffect(() => {
        console.log(conditions);
    }, [conditions]);

    useEffect(() => {
        console.log(selectedAddons);
    }, [selectedAddons]);

    const getOptionsWrapper = (addonsArray = null) => {
        getOptionsByAddon(addonsArray ? addonsArray[0]?.id : addons[0]?.id)
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    let arr = addonsArray ? addonsArray : addons;
                    setCurrentAddonOptions(arr?.map(() => {
                        return result;
                    }));
                    if(!updateMode && !addonsArray) {
                        setConditions(conditions?.map((item) => {
                            return {
                                active: item.active,
                                ifAddon: addons[0]?.id,
                                isEqual: result[0]?.id,
                                thenShow: item.thenShow
                            }
                        }));
                    }
                }
            });
    }

    useEffect(() => {
        if(addons?.length) {
            getOptionsWrapper();
        }
    }, [addons]);

    useEffect(() => {
        if(initialGallery?.length) {
            setGalleryLoaded(true);
        }
    }, [initialGallery]);

    useEffect(() => {
        if(status) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [status]);

    const toggleCondition = (i) => {
        setConditions(conditions?.map((item, index) => {
            if(index === i) return {...item, active: !item?.active}
            else return item;
        }));
    }

    const updateSelectedAddons = (i) => {
        setSelectedAddons(selectedAddons?.map((item, index) => {
            return index === i ? !item : item;
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

    const updateConditions = (i, property, value) => {
        setConditions(conditions?.map((item, index) => {
            if(index === i) {
                if(property === 'ifAddon') {
                    getAddonOptions(i, value);
                    return {...item, ifAddon: value};
                }
                else if(property === 'isEqual') {
                    return {...item, isEqual: value};
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


    const createNewProduct = () => {
        let formData = new FormData();
        for(let i=0; i<gallery.length; i++) {
            const item = gallery[i];
            let xhr = new XMLHttpRequest();
            xhr.open('GET', item.source, true);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if(this.status == 200) {
                    let myBlob = this.response;
                    formData.append('gallery', new File([myBlob], 'name'));
                }
                if(i === gallery.length-1) {
                    if(updateMode) {
                        updateProduct(formData, id, mainImageFile, namePl, nameEn, descriptionPl, descriptionEn, detailsPl, detailsEn, price, selectedType)
                            .then((res) => {

                                deleteAddonsForProduct(id)
                                    .then((res) => {
                                        if(res) {
                                            console.log(conditions);
                                            console.log(addons?.filter((item, index) => {
                                                return selectedAddons[index];
                                            })?.map((item, index) => {
                                                console.log(item);
                                                return {
                                                    addon: item.id,
                                                        ifAddon: conditions[index]?.active ? conditions[index].ifAddon : null,
                                                    isEqual: conditions[index]?.active ? conditions[index].isEqual : null
                                                }}
                                            ));


                                            addAddonsForProduct(id, addons?.filter((item, index) => {
                                                return selectedAddons[index];
                                            })?.map((item, index) => ({
                                                addon: item.id,
                                                ifAddon: conditions[index]?.active ? conditions[index].ifAddon : null,
                                                isEqual: conditions[index]?.active ? conditions[index].isEqual : null
                                            })))
                                                .then((res) => {
                                                    if(res?.status === 201) {
                                                        setStatus(1);
                                                    }
                                                    else {
                                                        setStatus(-2);
                                                    }
                                                })
                                                .catch(() => {
                                                    setStatus(-2);
                                                })
                                        }
                                        else {
                                            setStatus(-2);
                                        }
                                    })
                                    .catch(() => {
                                        setStatus(-2);
                                    });
                            })
                            .catch(() => {
                                setStatus(-2);
                            });
                    }
                    else {
                        addProduct(formData, mainImageFile, namePl, nameEn, descriptionPl, descriptionEn, detailsPl, detailsEn, price, selectedType)
                            .then((res) => {
                                const productId = res?.data?.result;
                                if(productId) {
                                    addAddonsForProduct(productId, addons?.filter((item, index) => {
                                        return selectedAddons[index];
                                    })?.map((item, index) => ({
                                        addon: item.id,
                                        ifAddon: conditions[index]?.active ? conditions[index].ifAddon : null,
                                        isEqual: conditions[index]?.active ? conditions[index].isEqual : null
                                    })))
                                        .then((res) => {
                                            if(res?.status === 201) {
                                                setStatus(1);
                                            }
                                            else {
                                                setStatus(-2);
                                            }
                                        })
                                        .catch(() => {
                                            setStatus(-2);
                                        })
                                }
                                else {
                                    setStatus(-2);
                                }
                            })
                            .catch(() => {
                                setStatus(-2);
                            });
                    }
                }
            };
            xhr.send();
        }
    }

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={1} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj produkt
                </h2>
                {status ? <span className="admin__status">
                        {status === -1 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -2) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Produkt został zaktualizowany' : 'Produkt został dodany'}
                        </span>}
                </span> : ""}

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
                    <h3 className="addProduct__addonsSection__header addProduct__addonsSection__header--addons">
                        Wybierz dodatki do wyboru dla klienta
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        {addons?.map((item, index) => {
                            return <>
                                <div className="addProduct__addonsSection__main__item flex">
                                    <label className="addProduct__addonsSection__label">
                                        <button className={selectedAddons[index] ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                                onClick={() => { updateSelectedAddons(index); }}>

                                        </button>
                                        <span>
                                    {item.name_pl}
                                </span>
                                    </label>

                                    <button className="addProduct__addonsSection__addCondition" onClick={() => { toggleCondition(index); }}>
                                        {conditions[index]?.active ? 'Usuń warunek' : 'Dodaj warunek'}
                                    </button>
                                </div>

                                {conditions[index]?.active ? <div className="addProduct__addonsSection__condition">
                                    Pokazuj ten dodatek jeśli dodatek:
                                    <label>
                                        <select value={conditions[index]?.ifAddon}
                                                onChange={(e) => { updateConditions(index, 'ifAddon', e.target.value); }}>
                                            {addons?.map((item, index) => {
                                                return <option key={index} value={item.id}>
                                                    {item.name_pl}
                                                </option>
                                            })}
                                        </select>
                                    </label>
                                    jest równy:
                                    <label>
                                        <select value={conditions[index]?.isEqual}
                                                onChange={(e) => { updateConditions(index, 'isEqual', e.target.value); }}>
                                            {currentAddonOptions[index]?.map((item, index) => {
                                                return <option key={index} value={item.id}>
                                                    {item.name_pl}
                                                </option>
                                            })}
                                        </select>
                                    </label>
                                </div> : ''}
                            </>
                        })}
                    </div>
                </div>

                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Wybierz typ obuwia
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
                        Dodaj zdjęcie wyróżniające
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
                        Dodaj galerię zdjęć
                    </h3>
                    <div className="uploadGalleryWrapper">
                        {galleryLoaded ? <RUG
                            onChange={(images) => {
                                setGallery(images);
                            }}
                            autoUpload={false}
                            initialState={initialGallery}
                            action={`http://localhost:5000/save/1`} // upload route
                            source={response => response.source} // response image source
                        /> : ''}
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
