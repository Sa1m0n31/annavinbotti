import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {ContentContext} from "../../App";
import {getField} from "../../helpers/content";
import {convertFromRaw} from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import LoadingPage from "../../components/shop/LoadingPage";
import OrderInstruction from "../../components/shop/OrderInstruction";

const PageWithDownload = ({title, text, field, downloadName, width100, link, buttonText}) => {
    const { language } = useContext(ContentContext);

    const [pageContent, setPageContent] = useState(null);

    useEffect(() => {
        if(field) {
            getField(field)
                .then((res) => {
                    if(res?.status === 200) {
                        const pageContentLocal = res?.data?.result[0]?.[language === 'pl' ? 'value_pl' : 'value_en'];
                        if(pageContentLocal) {
                            setPageContent(pageContentLocal);
                        }
                    }
                });
        }
    }, [field, language]);

    return pageContent ? <div className="container">
        <PageHeader />
        <main className="page w">
            <h1 className={width100 ? "pageHeading page100" : "pageHeading"}>
                {title}
            </h1>

            <article id={field} className={width100 ? "page__content page100" : "page__content"}>
                <p>
                    {text}
                </p>
                <div className="page__linkWrapper">
                    <a href={link}
                       target="_blank"
                       className="page__link"
                       download={downloadName}>
                        {buttonText}
                    </a>
                </div>
            </article>
        </main>
        <Footer />
    </div> : <LoadingPage />
};

export default PageWithDownload;
