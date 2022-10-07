import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getAllBlogPosts, getPostBySlug} from "../../helpers/blog";
import {ContentContext} from "../../App";
import {getDate} from "../../helpers/others";
import constans from "../../helpers/constants";
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import Loader from "../../components/shop/Loader";

const BlogPostPreview = () => {
    const { language } = useContext(ContentContext);

    const [rendering, setRendering] = useState(true);
    const [post, setPost] = useState({});

    useEffect(() => {
        const articleObject = localStorage.getItem('articleObject') ? JSON.parse(localStorage.getItem('articleObject')) : null;

        if(articleObject) {
            setPost(articleObject);
            setRendering(false);
        }
        else {
            window.location = '/panel';
        }
    }, []);

    return <div className="container">
        <PageHeader />

        {rendering ? <div className="container--loader container--loader--blogPost">
            <Loader />
        </div> : <main className="post w">
            <h1 className="blog__header blog__header--post">
                {language === 'pl' ? post.title_pl : post.title_en}
            </h1>
            <div className="blog__meta flex">
                <p>
                    Anna Vinbotti
                </p>
                <p>
                    {getDate(post.publication_date)}
                </p>
            </div>
            <figure className="post__mainImg">
                <img className="img" src={post.image} alt={post?.title_pl} />
            </figure>
            {post?.content_pl ? <article className="post__article" dangerouslySetInnerHTML={{__html: language === 'pl' ? post?.content_pl : post?.content_en }}>

            </article> : ''}
        </main>}

        <Footer />
    </div>
};

export default BlogPostPreview;
