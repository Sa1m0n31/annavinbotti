import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {deleteAddon, getAllAddons} from "../../helpers/products";
import ProductListItem from "../../components/admin/ProductListItem";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";

const AddonList = () => {
    const [addons, setAddons] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        getAllAddons()
            .then((res) => {
                if(res?.status === 200) {
                    setAddons(res?.data?.result);
                }
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

    const deleteAddonById = () => {
        deleteAddon(deleteCandidate)
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

    return <div className="container container--admin container--addProduct">
        <AdminTop />

        {deleteCandidate ? <AdminDeleteModal id={deleteCandidate}
                                             header="Usuwanie dodatku"
                                             text={`Czy na pewno chcesz usunąć dodatek ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Dodatek został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteAddonById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={2} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Lista dodatków
                </h2>
                {addons?.map((item, index) => {
                    return <ProductListItem index={index}
                                            id={item.id}
                                            openDeleteModal={openDeleteModal}
                                            name={item.name_pl}
                                            addonType={item.addon_type} />
                })}
            </main>
        </div>
    </div>
};

export default AddonList;
