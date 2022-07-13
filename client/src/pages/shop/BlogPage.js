import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getAllBlogPosts} from "../../helpers/blog";
import {ContentContext} from "../../App";
import constans from "../../helpers/constants";
import Loader from "../../components/shop/Loader";

const BlogPage = () => {
    const { language } = useContext(ContentContext);

    const [render, setRender] = useState(true);
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        getAllBlogPosts()
            .then((res) => {
                if(res?.status === 200) {
                    setPosts(res?.data?.result);
                }
                else {
                    window.location = '/';
                }
            });
    }, []);

    useEffect(() => {
        if(posts?.length) {
            setRender(false);
            setVisiblePosts(posts.slice(page * 9, page * 9 + 9));
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [posts, page]);

    return <div className="container">
        <PageHeader />

        {render ? <div className="container--loader container--loader--blogPost">
            <Loader />
        </div> : <main className="blog w">
            <h1 className="blog__header">
                Blog
            </h1>
            <div className="blog__content">
                {visiblePosts?.map((item, index) => {
                    return <a key={index}
                              className="blog__content__item"
                              href={`/post/${item.slug}`}>
                        <figure className="blog__content__item__imgWrapper">
                            <img className="img" src={`${constans.IMAGE_URL}/media/blog/${item.image}`} alt={item.title_pl} />
                        </figure>
                        <h3 className="blog__content__item__header">
                            {language === 'pl'? item.title_pl : item.title_en}
                        </h3>
                        <p className="blog__content__item__excerpt">
                            {language === 'pl' ? item.excerpt_pl : item.excerpt_en}
                        </p>
                        <span className="blog__content__item__btn">
                            {language === 'pl' ? 'Czytaj dalej' : 'Read more'}
                        </span>
                    </a>
                })}
            </div>

            {posts?.length > 9 ? <div className="blog__pagination flex">
                <button className={page === 0 ? 'blog__pagination__btn blog__pagination__btn--hidden' : "blog__pagination__btn blog__pagination__btn--prev"}
                        onClick={() => { setPage(page-1); }}
                >
                    &lt; <span className="d-desktop">Poprzednia</span>
                </button>

                <div className="blog__pagination__pages">
                    {Array.from(Array(Math.ceil(posts?.length / 9)).keys())?.map((item, index) => {
                        return <button className={page === item ? "blog__pagination__pages__btn blog__pagination__pages__btn--selected" : "blog__pagination__pages__btn"}
                                       key={index}
                                       onClick={() => { setPage(item); }}>
                            {item+1}
                        </button>
                    })}
                </div>

                <button className={page + 1 === Math.ceil(posts?.length / 9) ? "blog__pagination__btn blog__pagination__btn--hidden" : "blog__pagination__btn blog__pagination__btn--next"}
                        onClick={() => { setPage(page+1); }}
                >
                    <span className="d-desktop">Następna</span> &gt;
                </button>
            </div> : ''}
        </main>}

        <Footer />
    </div>
};

export default BlogPage;
