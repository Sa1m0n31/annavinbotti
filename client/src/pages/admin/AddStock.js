import React, {useEffect, useState} from 'react';
import {getAllAddonsAndAddonsOptions, getAllAddonsOptions, getAllProducts} from "../../helpers/products";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {
    addAddonStock,
    addProductStock, deleteAddonStock,
    deleteProductStock,
    getAddonStockDetails,
    getProductStockDetails
} from "../../helpers/stocks";
import {scrollToTop} from "../../helpers/others";

const AddStock = ({type}) => {
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [counter, setCounter] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItemsSet, setSelectedItemsSet] = useState(false);
    const [allItems, setAllItems] = useState([]);
    const [status, setStatus] = useState(0);
    const [updateMode, setUpdateMode] = useState(false);

    const isElementInArray = (el, arr) => {
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }

    useEffect(() => {
        if(type === 0) {
            getAllProducts()
                .then((res) => {
                    if(res?.status === 200) {
                        setAllItems(res?.data?.result);
                    }
                    else {
                        window.location = '/panel';
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                });
        }
        else {
            getAllAddonsAndAddonsOptions()
                .then((res) => {
                    if(res?.status === 200) {
                        setAllItems(res?.data?.result);
                    }
                    else {
                        window.location = '/panel';
                    }
                })
                .catch(() => {
                    window.location = '/panel';
                })
        }
    }, [type]);

    useEffect(() => {
        if(selectedItemsSet) {
            const idParam = new URLSearchParams(window.location.search).get('id');
            if(idParam) {
                setId(parseInt(idParam));
                setUpdateMode(true);

                const func = type === 0 ? getProductStockDetails : getAddonStockDetails;

                func(idParam)
                    .then((res) => {
                        const result = res?.data?.result;
                        console.log(res?.data);
                        if(result) {
                            setName(result[0].name);
                            setCounter(result[0].counter);
                            const selectedIds = result?.map((item) => (item.product_id));
                            setSelectedItems(selectedItems?.map((item, index) => {
                                if(isElementInArray(allItems[index].id, selectedIds)) {
                                    return true;
                                }
                                else {
                                    return item;
                                }
                            }));
                        }
                    });
            }
        }
    }, [selectedItemsSet]);

    useEffect(() => {
        setSelectedItems(allItems?.map((item) => {
            return false;
        }));
    }, [allItems]);

    useEffect(() => {
        if(selectedItems?.length) setSelectedItemsSet(true);
    }, [selectedItems]);

    const updateSelectedItems = (i) => {
        setSelectedItems(selectedItems?.map((item, index) => {
            return index === i ? !item : item;
        }));
    }

    const createNewStock = () => {
        if(name) {
            const itemList = allItems?.filter((item, index) => {
                return selectedItems[index];
            })?.map((item) => {
                return item.id;
            });

            if(!updateMode) {
                const func = type === 0 ? addProductStock : addAddonStock;

                func(name, counter, itemList)
                    .then((res) => {
                        if(res?.status === 201) {
                            setStatus(1);
                        }
                        else {
                            setStatus(-1);
                        }
                    })
                    .catch((err) => {
                        if(err?.response?.status === 503) {
                            setStatus(-3);
                        }
                        else {
                            setStatus(-1);
                        }
                    });
            }
            else {
                const deleteFunc = type === 0 ? deleteProductStock : deleteAddonStock;

                const itemList = allItems?.filter((item, index) => {
                    return selectedItems[index];
                })?.map((item) => {
                    return item.id;
                });

                deleteFunc(id)
                    .then((res) => {
                        if(res?.status === 201) {
                            const addFunc = type === 0 ? addProductStock : addAddonStock;

                            addFunc(name, counter, itemList)
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
                        else {
                            setStatus(-1);
                        }
                    });
            }
        }
        else {
            setStatus(-2);
        }
    }

    useEffect(() => {
        if(status) {
            setTimeout(() => {
                setStatus(0);
            }, 2000);
            scrollToTop();
        }
    }, [status]);

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={3} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Dodaj stan magazynowy
                </h2>
                {status ? <span className="admin__status admin__status--stock">
                        {status === -2 ? <span className="admin__status__inner admin__status--error">
                            Uzupełnij wymagane pola
                        </span> : (status === -1) ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : (status === -3 ? <span className="admin__status__inner admin__status--error">
                            Wybrane {type === 0 ? "produkty" : "dodatki"} należą już do innych stanów magazynowych
                        </span> : <span className="admin__status__inner admin__status--success">
                            {updateMode ? 'Stan magazynowy został zaktualizowany' : 'Stan magazynowy został dodany'}
                        </span>)}
                </span> : ""}

                <label>
                    Nazwa stanu magazynowego
                    <input className="input"
                           placeholder="Nazwa stanu magazynowego"
                           value={name}
                           onChange={(e) => { setName(e.target.value); }} />
                </label>
                <label>
                    Ile na stanie
                    <input className="input"
                           type="number"
                           placeholder="Ilość na stanie"
                           value={counter}
                           onChange={(e) => { setCounter(e.target.value); }} />
                </label>
                <div className="addProduct__addonsSection">
                    <h3 className="addProduct__addonsSection__header">
                        Wybierz {type === 0 ? 'produkty' : 'dodatki'}, których dotyczy ten stan magazynowy
                    </h3>
                    <div className="addProduct__addonsSection__main">
                        {allItems?.map((item, index) => {
                            return <label className="addProduct__addonsSection__label">
                                <button className={selectedItems[index] ? "addProduct__addonsSection__btn addProduct__addonsSection__btn--selected" : "addProduct__addonsSection__btn"}
                                        onClick={() => { updateSelectedItems(index); }}>

                                </button>
                                {type === 0 ? <span>
                                    {item.name_pl}
                                </span> : <span>
                                    {item.addon_name} -> {item.addon_option_name}
                                </span>}
                            </label>
                        })}
                    </div>
                </div>

                <button className="btn btn--admin btn--admin--type" onClick={() => { createNewStock(); }}>
                    {updateMode ? "Zaktualizuj stan magazynowy" : "Dodaj stan magazynowy"}
                </button>
            </main>
        </div>
    </div>
};

export default AddStock;
