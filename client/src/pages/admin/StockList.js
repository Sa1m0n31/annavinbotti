import React, {useEffect, useState} from 'react';
import {deleteAddon, deleteType, getAllProducts, getAllTypes} from "../../helpers/products";
import AdminTop from "../../components/admin/AdminTop";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import AdminMenu from "../../components/admin/AdminMenu";
import TypeListItem from "../../components/admin/TypeListItem";
import {
    deleteAddonStock,
    deleteProductStock,
    getAllAddonsStocks,
    getAllProductStocks,
    getAllStocks
} from "../../helpers/stocks";
import StockListItem from "../../components/admin/StockListItem";

const StockList = ({type}) => {
    const [stocks, setStocks] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        const func = type === 0 ? getAllProductStocks : getAllAddonsStocks;
        func()
            .then((res) => {
                if(res.status === 200) {
                    setStocks(res?.data?.result);
                }
                else {
                    window.location = '/';
                }
            })
            .catch((err) => {
                window.location = '/';
            });
    }, [deleteStatus, type]);

    const openDeleteModal = (id, name) => {
        setDeleteCandidate(id);
        setDeleteCandidateName(name);
    }

    const closeDeleteModal = () => {
        setDeleteCandidate(0);
        setDeleteCandidateName('');
    }

    const deleteTypeById = () => {
        const func = type === 0 ? deleteProductStock : deleteAddonStock;
        func(deleteCandidate)
            .then((res) => {
                if(res?.status === 201) {
                    setDeleteStatus(1);
                }
                else {
                    setDeleteStatus(-1);
                }
            })
            .catch(() => {
                setDeleteStatus(-1);
            });
    }

    useEffect(() => {
        if(deleteStatus !== 0) {
            setTimeout(() => {
                setDeleteStatus(0);
                setDeleteCandidate(0);
                setDeleteCandidateName("");
            }, 2000);
        }
    }, [deleteStatus]);

    return <div className="container container--admin">
        <AdminTop />

        {deleteCandidate ? <AdminDeleteModal id={deleteCandidate}
                                             header="Usuwanie stanu magazynowego"
                                             text={`Czy na pewno chcesz usunąć stan magazynowy ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Stan magazynowy został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteTypeById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={3} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Lista stanów magazynowych {type === 0 ? "modeli" : "dodatków"}
                </h2>
                {stocks?.map((item, index) => {
                    return <StockListItem index={index}
                                         id={item.id}
                                         openDeleteModal={openDeleteModal}
                                         name={item.name}
                                         type={type}
                                         counter={item.counter} />
                })}
            </main>
        </div>
    </div>
};

export default StockList;
