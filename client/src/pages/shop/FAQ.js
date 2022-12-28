import React, {useContext, useEffect, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getFAQ} from "../../helpers/content";
import {ContentContext} from "../../App";

const Faq = () => {
    const { language } = useContext(ContentContext);

    const [sections, setSections] = useState([]);
    const [visibleQuestions, setVisibleQuestions] = useState([]);

    useEffect(() => {
        getFAQ()
            .then((res) => {
                if(res?.status === 200) {
                    const r = res?.data?.result[0];
                    setSections(JSON.parse(language === 'pl' ? r.value_pl : r.value_en));
                }
            });
    }, []);

    useEffect(() => {
        if(sections?.length) {
            setVisibleQuestions(sections?.map((item) => {
                return item?.questions?.map(() => false);
            }));
        }
    }, [sections]);

    const changeVisibleQuestions = (section, question) => {
        setVisibleQuestions(visibleQuestions?.map((item, index) => {
            if(index === section) {
                return item.map((item, index) => {
                    return index === question ? !item : item;
                });
            }
            else {
                return item;
            }
        }));
    }

    const isQuestionVisible = (section, question) => {
        if(visibleQuestions?.length > section && visibleQuestions[section]?.length > question) {
            return visibleQuestions[section][question];
        }
        else {
            return false;
        }
    }

    return <div className="container">
        <PageHeader />
        <main className="faq w">
            <h1 className="pageHeader">
                Najczęściej zadawane pytania
            </h1>
            {sections?.map((item, index) => {
                const sectionIndex = index;
                return <section className="faq__section" key={index}>
                    <h2 className="faq__section__header">
                        {item.header}
                    </h2>
                    {item.questions?.map((item, index) => {
                        return <div className="faq__section__question" key={index}>
                            <button className="faq__section__question__question flex"
                                    onClick={() => { changeVisibleQuestions(sectionIndex, index); }}
                            >
                                <span>
                                    {item.question}
                                </span>
                                <span>
                                    {!isQuestionVisible(sectionIndex, index) ? '+' : '-'}
                                </span>
                            </button>
                            <p dangerouslySetInnerHTML={{__html: item.answer}}
                                className={isQuestionVisible(sectionIndex, index) ? "faq__section__question__answer faq__section__question__answer--visible" : "faq__section__question__answer"}>

                            </p>
                        </div>
                    })}
                </section>
            })}
        </main>
        <Footer />
    </div>
};

export default Faq;
