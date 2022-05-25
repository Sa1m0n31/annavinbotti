import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {deleteAddon, deleteProduct, getAllProducts} from "../../helpers/products";
import ProductListItem from "../../components/admin/ProductListItem";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        getAllProducts()
            .then((res) => {
               if(res.status === 200) {
                   setProducts(res?.data?.result);
               }
               else {
                   window.location = '/';
               }
            })
            .catch(() => {
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

    const deleteAddonById = () => {
        deleteProduct(deleteCandidate)
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
                                             header="Usuwanie produktu"
                                             text={`Czy na pewno chcesz usunąć produkt ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Produkt został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteAddonById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={1} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Lista produktów
                </h2>
                {products?.map((item, index) => {
                    return <ProductListItem index={index}
                                            id={item.id}
                                            name={item.name_pl}
                                            type={item.type}
                                            openDeleteModal={openDeleteModal}
                                            img={item.main_image}
                    />
                })}
            </main>
        </div>
    </div>
};

export default ProductList;
