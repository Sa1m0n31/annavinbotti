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

const BlogPost = () => {
    const { language } = useContext(ContentContext);

    const [rendering, setRendering] = useState(true);
    const [post, setPost] = useState({});
    const [allPosts, setAllPosts] = useState([]);
    const [prevPostData, setPrevPostData] = useState(null);
    const [nextPostData, setNextPostData] = useState(null);

    useEffect(() => {
        const slug = window.location.href.split('/')[window.location.href.split('/').length-1];

        getAllBlogPosts()
            .then((res) => {
                if(res?.status === 200) {
                    setAllPosts(res?.data?.result);
                }
            });

        getPostBySlug(slug)
            .then((res) => {
                if(res?.data?.result?.length) {
                    setPost(res?.data?.result[0]);
                }
                else {
                    window.location = '/';
                }
            })
            .catch(() => {
                window.location = '/';
            });
    }, []);

    useEffect(() => {
        if(post?.id) {
            setRendering(false);
        }
    }, [post]);

    useEffect(() => {
        if(allPosts?.length && post?.id) {
            const currentPostIndex = allPosts.findIndex((item) => {
                return item.id === post.id;
            });

            let prevPost, nextPost;
            if(currentPostIndex === 0) {
                nextPost = allPosts[currentPostIndex+1];

                setNextPostData(nextPost);
            }
            else if(currentPostIndex === allPosts.length-1) {
                prevPost = allPosts[currentPostIndex-1];

                setPrevPostData(prevPost);
            }
            else {
                nextPost = allPosts[currentPostIndex+1];
                prevPost = allPosts[currentPostIndex-1];

                setPrevPostData(prevPost);
                setNextPostData(nextPost);
            }
        }
    }, [allPosts, post]);

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
                <img className="img" src={`${constans.IMAGE_URL}/media/blog/${post?.image}`} alt={post?.title_pl} />
            </figure>
            {post?.content_pl ? <article className="post__article" dangerouslySetInnerHTML={{__html: stateToHTML((convertFromRaw(JSON.parse(
                    language === 'pl' ? post?.content_pl : post?.content_en)
                )))}}>

            </article> : ''}

            <div className="post__bottom flex">
                <a className={prevPostData ? "post__bottom__btn" : "post__bottom__btn post__bottom__btn--hidden"}
                   href={`/post/${prevPostData?.slug}`}
                >
                    <span>
                        &lt; Poprzedni <span className="d-desktop">post</span>
                    </span>
                    <span>
                        {language === 'pl' ? prevPostData?.title_pl : prevPostData?.title_en}
                    </span>
                </a>

                <a className={nextPostData ? "post__bottom__btn" : "post__bottom__btn post__bottom__btn--hidden"}
                   href={`/post/${nextPostData?.slug}`}
                >
                    <span>
                        Następny <span className="d-desktop">post</span> &gt;
                    </span>
                    <span>
                        {language === 'pl' ? nextPostData?.title_pl : nextPostData?.title_en}
                    </span>
                </a>
            </div>
        </main>}

        <Footer />
    </div>
};

export default BlogPost;
