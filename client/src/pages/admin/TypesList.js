import React, {useEffect, useState} from 'react';
import {deleteAddon, deleteType, getAllProducts, getAllTypes} from "../../helpers/products";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import ProductListItem from "../../components/admin/ProductListItem";
import TypeListItem from "../../components/admin/TypeListItem";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";

const TypesList = () => {
    const [types, setTypes] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        getAllTypes()
            .then((res) => {
                if(res.status === 200) {
                    setTypes(res?.data?.result);
                }
                else {
                    window.location = '/';
                }
            })
            .catch((err) => {
                window.location = '/';
            });
    }, [deleteStatus]);

    const openDeleteModal = (id, name) => {
        setDeleteCandidate(id);
        setDeleteCandidateName(name);
    }

    const closeDeleteModal = () => {
        setDeleteCandidate(0);
        setDeleteCandidateName('');
    }

    const deleteTypeById = () => {
        deleteType(deleteCandidate)
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
                                             header="Usuwanie typu"
                                             text={`Czy na pewno chcesz usunąć typ ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Typ został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteTypeById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={4} />
            <main className="admin__main admin__main--addonList">
                <h2 className="admin__main__header">
                    Lista typów
                </h2>
                {types?.map((item, index) => {
                    return <TypeListItem index={index}
                                         id={item.id}
                                         openDeleteModal={openDeleteModal}
                                         namePl={item.name_pl}
                                         nameEn={item.name_en} />
                })}
            </main>
        </div>
    </div>
};

export default TypesList;
