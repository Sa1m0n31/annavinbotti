import React, {useEffect, useState} from 'react';
import AdminTerms from "../../components/admin/AdminTerms";
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {getFAQ} from "../../helpers/content";
import {updateFaq} from "../../helpers/admin";
import {scrollToTop} from "../../helpers/others";
import Loader from "../../components/shop/Loader";

const AdminFAQ = () => {
    const [faq, setFaq] = useState([]);
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getFAQ()
            .then((res) => {
                if(res?.status === 200) {
                    setFaq(JSON.parse(res?.data?.result[0].value_pl));
                }
            });
    }, []);

    const updateSectionHeader = (section, val) => {
        setFaq(prevState => (prevState.map((item, index) => {
            if(index === section) {
                return {...item, header: val}
            }
            else {
                return item;
            }
        })))
    }

    const updateQuestion = (section, question, val) => {
        setFaq(prevState => (prevState.map((item, index) => {
            if(index === section) {
                return {...item, questions: item.questions.map((item, index) => {
                    if(index === question) {
                        return {...item, question: val}
                    }
                    else {
                        return item;
                    }
                })}
            }
            else {
                return item;
            }
        })))
    }

    const updateAnswer = (section, question, val) => {
        setFaq(prevState => (prevState.map((item, index) => {
            if(index === section) {
                return {...item, questions: item.questions.map((item, index) => {
                        if(index === question) {
                            return {...item, answer: val}
                        }
                        else {
                            return item;
                        }
                    })}
            }
            else {
                return item;
            }
        })))
    }

    const addSection = () => {
        setFaq(prevState => [...prevState, {
            header: '',
            questions: [
                {
                    question: '',
                    answer: ''
                }
            ]
        }]);
    }

    const addQuestion = (section) => {
        setFaq(prevState => (prevState.map((item, index) => {
            if(index === section) {
                return {
                    ...item,
                    questions: [...item.questions, {
                        question: '',
                        answer: ''
                    }]
                }
            }
            else {
                return item;
            }
        })));
    }

    const removeSection = (section) => {
        setFaq(prevState => (prevState.filter((item, index) => (index !== section))));
    }

    const removeQuestion = (section, question) => {
        setFaq(prevState => (prevState.map((item, index) => {
            if(index === section) {
                return {...item,
                    questions: item.questions.filter((item, index) => (index !== question))}
            }
            else {
                return item;
            }
        })))
    }

    const handleSubmit = () => {
        setLoading(true);
        updateFaq(JSON.stringify(faq))
            .then((res) => {
                if(res?.status === 201) {
                    setStatus(1);
                }
                else {
                    setStatus(-1);
                }
            })
            .catch(() => {
                setStatus(-1);
            });
    }

    useEffect(() => {
        if(status) {
            setLoading(false);
            scrollToTop();

            setTimeout(() => {
                setStatus(0);
            }, 3000);
        }
    }, [status]);

    return <div className="container container--admin container--addProduct">
        <AdminTop />
        <div className="admin">
            <AdminMenu menuOpen={8} />
            <main className="admin__main">
                <h2 className="admin__main__header admin__main__header--faq">
                    Edycja FAQ

                    <button className="btn btn--addSection"
                            onClick={() => { addSection(); }}>
                        Dodaj sekcję
                    </button>
                </h2>
                {status ? <span className="admin__status">
                        {status !== 1 ? <span className="admin__status__inner admin__status--error">
                            Coś poszło nie tak... Skontaktuj się z administratorem systemu
                        </span> : <span className="admin__status__inner admin__status--success">
                            Sekcja FAQ została zaktualizowana
                        </span>}
                </span> : ""}

                <div className="admin__faq">
                    {faq.map((item, index) => {
                        const sectionIndex = index;
                        return <div className="admin__faq__section" key={index}>
                            <div className="admin__faq__section__headerWrapper">
                                <label className="admin__faq__section__header__label">
                                    Nagłówek sekcji
                                    <input className="input"
                                           placeholder="Nagłówek"
                                           value={item.header}
                                           onChange={(e) => { updateSectionHeader(index, e.target.value); }} />
                                </label>
                                <div className="admin__faq__section__header__buttons">
                                    <button className="btn btn--addSection btn--addQuestion"
                                            onClick={() => { addQuestion(index); }}>
                                        Dodaj pytanie
                                    </button>
                                    <button className="btn btn--addSection btn--addQuestion btn--delete"
                                            onClick={() => { removeSection(index); }}>
                                        Usuń sekcję
                                    </button>
                                </div>
                            </div>

                            <h3 className="admin__faq__section__header">
                                Pytania
                            </h3>
                            {item.questions.map((item, index) => {
                                return <div className="admin__faq__section__questions" key={index}>
                                    <div className="admin__faq__section__headerWrapper">
                                        <label className="admin__faq__section__header__label">
                                            Pytanie
                                            <input className="input"
                                                   placeholder="Pytanie"
                                                   value={item.question}
                                                   onChange={(e) => { updateQuestion(sectionIndex, index, e.target.value); }} />
                                        </label>
                                        <button className="btn btn--delete btn--deleteQuestion"
                                                onClick={() => { removeQuestion(sectionIndex, index); }}>
                                            &times;
                                        </button>
                                    </div>
                                    <label>
                                        Odpowiedź
                                        <textarea className="input input--textarea"
                                               placeholder="Odpowiedź"
                                               value={item.answer}
                                               onChange={(e) => { updateAnswer(sectionIndex, index, e.target.value); }}>

                                        </textarea>
                                    </label>
                                </div>
                            })}
                        </div>
                    })}
                </div>

                {!loading ? <button className="btn btn--submit"
                                    onClick={() => { handleSubmit() }}>
                    Aktualizuj FAQ
                </button> : <div className="center">
                    <Loader />
                </div> }
            </main>
        </div>
    </div>
};

export default AdminFAQ;
