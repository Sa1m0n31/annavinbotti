import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import settings from "../../static/settings";
import trashIcon from '../../static/img/trash.svg'
import Dropzone from "react-dropzone-uploader";
import { SketchPicker } from "react-color";
import ColorModal from "../../components/admin/ColorModal";
import {addAddon, addAddonOption} from "../../helpers/products";
import Loader from "../../components/admin/Loader";
import Waiting from "../../components/admin/Loader";
import {scrollToTop} from "../../helpers/others";

const AddAddon = () => {
    const [namePl, setNamePl] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [addonType, setAddonType] = useState(0);
    const [options, setOptions] = useState([
        {
            namePl: '',
            nameEn: '',
            image: null,
            color: '',
            updateImage: false
        }
    ]);
    const [colorModal, setColorModal] = useState(false);
    const [currentOption, setCurrentOption] = useState(-1);
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    const addNewOption = () => {
        setOptions([...options, {
            namePl: '',
            nameEn: '',
            image: null,
            color: '',
            updateImage: false
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
                if(item.image) {
                    item.image.remove();
                }
                item.image = null;
                item.updateImage = false;
                return item;
            }
            else {
                return item;
            }
        }))
    }

    const changeCurrentOptionColor = (color, event) => {
        setOptions(options?.map((item, index) => {
            if(index === currentOption) {
                item.color = color.hex;
            }
            return item;
        }));
    }

    const deleteAddonOption = () => {
        setOptions(options?.filter((item, index, array) => {
            return index !== array.length-1;
        }));
    }

    const createNewAddon = () => {
        if(addonType && namePl && nameEn) {
            setLoading(true);
            addAddon(namePl, nameEn, addonType)
                .then((res) => {
                   if(res.status === 201) {
                       const id = res?.data?.result;
                       if(id) {
                           options.forEach((item, index, array) => {
                               addAddonOption(id, item.namePl, item.nameEn, addonType === 3 ? item.color : null, addonType === 2 ? item.image?.file : null)
                                   .then((res) => {
                                        if(res.status === 201) {
                                            if(index === array.length-1) {
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
                           });
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
                item.image = status;
                return item;
            }
            else {
                return item;
            }
        }))
    }

    return <div className="container container--admin container--addProduct">
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
                            Dodatek został dodany
                        </span>}
                </span> : ""}

                <label>
                    Nazwa dodatku (polski)
                    <input className="input"
                           placeholder="Polska nazwa dodatku"
                           value={namePl}
                           onChange={(e) => { setNamePl(e.target.value); }} />
                </label>
                <label>
                    Nazwa dodatku (angielski)
                    <input className="input"
                           placeholder="Angielska nazwa dodatku"
                           value={nameEn}
                           onChange={(e) => { setNameEn(e.target.value); }} />
                </label>
                <label>
                    Typ dodatku (co będzie wybierał klient)
                    <span className="flex">
                        <button className={addonType === 1 ? "btn btn--choose btn--choose--selected" : "btn btn--choose"}
                            onClick={() => { setAddonType(1); }}>
                            Tekst
                        </button>
                        <button className={addonType === 2 ? "btn btn--choose btn--choose--selected" : "btn btn--choose"}
                                onClick={() => { setAddonType(2); }}>
                            Tekst + zdjęcie
                        </button>
                        <button className={addonType === 3 ? "btn btn--choose btn--choose--selected" : "btn btn--choose"}
                                onClick={() => { setAddonType(3); }}>
                            Kolor
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
                    <button className="btn btn--addOption" onClick={() => { deleteAddonOption(); }}>
                        -
                    </button>
                </header>

                {options?.map((item, index) => {
                    return <div className="flex singleOption">
                        <span className="singleOption__number">
                            {index+1}
                        </span>
                        <label>
                            Polska nazwa opcji
                            <input className="input"
                                   placeholder="Polska nazwa opcji"
                                   value={item.namePl}
                                   onChange={(e) => { updateOptions(index, 'namePl', e); }} />
                        </label>
                        <label>
                            Angielska nazwa opcji
                            <input className="input"
                                   placeholder="Angielska nazwa opcji"
                                   value={item.nameEn}
                                   onChange={(e) => { updateOptions(index, 'nameEn', e); }} />
                        </label>
                        <label className={addonType === 1 ? 'hidden' : "admin__label admin__flex"}>
                            {addonType === 3 ? 'Kolor' : (addonType === 2 ? 'Zdjęcie' : '')}
                            <span className={addonType !== 3 ? 'hidden' : "admin__label__color flex"}>
                                <button className="btn btn--openColorModal" onClick={() => { setCurrentOption(index); }}>
                                    Zmień kolor
                                </button>
                                <span className="showColor" style={{
                                    background: item.color
                                }}>
                                </span>
                            </span>

                            <span className={addonType !== 2 ? 'hidden' : "admin__label__imgUpload"}>
                                {item.updateImage ? <figure className="admin__label__imgUpload__updateImgWrapper">
                                    <img className="admin__label__imgUpload__updateImg" src={`${settings.API_URL}/image?url=/media/blog/${item.updateImage}`} alt="foto" />
                                </figure> : ""}
                                {item.updateImage || item.image ? <button className="admin__label__imgUpload__trashBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); deleteImgFromAddon(index); }}>
                                    &times;
                                </button> : ""}
                                <Dropzone
                                    canRemove={true}
                                    getUploadParams={getUploadImage}
                                    onChangeStatus={(status) => { handleChangeStatus(index, status); }}
                                    accept="image/*"
                                    maxFiles={1} />
                            </span>
                        </label>
                    </div>
                })}

                {colorModal ? <ColorModal color={options[currentOption].color}
                                          closeModalFunction={() => { setColorModal(false); }}
                                          onChange={changeCurrentOptionColor}
                /> : ""}

                {!loading ? <button className="btn btn--admin" onClick={() => { createNewAddon(); }}>
                    Dodaj dodatek
                </button> : <Waiting />}
            </main>
        </div>
    </div>
};

export default AddAddon;
