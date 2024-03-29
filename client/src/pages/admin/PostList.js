import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminDeleteModal from "../../components/admin/AdminDeleteModal";
import AdminMenu from "../../components/admin/AdminMenu";
import {deleteBlogPost, getAllBlogPosts} from "../../helpers/blog";
import BlogListItem from "../../components/admin/BlogListItem";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [deleteCandidate, setDeleteCandidate] = useState(0);
    const [deleteCandidateName, setDeleteCandidateName] = useState("");
    const [deleteStatus, setDeleteStatus] = useState(0);

    useEffect(() => {
        getAllBlogPosts()
            .then((res) => {
                if(res.status === 200) {
                    setPosts(res?.data?.result);
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
        deleteBlogPost(deleteCandidate)
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
                                             header="Usuwanie wpisu"
                                             text={`Czy na pewno chcesz usunąć wpis ${deleteCandidateName}?`}
                                             btnText="Usuń"
                                             success="Wpis został usunięty"
                                             fail="Coś poszło nie tak... Prosimy skontaktować się z administratorem systemu"
                                             deleteStatus={deleteStatus}
                                             deleteFunction={deleteAddonById}
                                             closeModalFunction={closeDeleteModal} /> : ''}

        <div className="admin">
            <AdminMenu menuOpen={6} />
            <main className="admin__main">
                <h2 className="admin__main__header">
                    Lista artykułów
                </h2>
                {posts?.map((item, index) => {
                    return <BlogListItem index={index}
                                            id={item.id}
                                            name={item.title_pl}
                                            date={item.publication_date?.substring(0, 10)}
                                            openDeleteModal={openDeleteModal}
                                            img={item.image}
                    />
                })}
            </main>
        </div>
    </div>
};

export default PostList;
