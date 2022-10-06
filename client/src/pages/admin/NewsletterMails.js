import React, {useEffect, useState} from 'react';
import AdminTop from "../../components/admin/AdminTop";
import AdminMenu from "../../components/admin/AdminMenu";
import {getAllNewsletters} from "../../helpers/newsletter";
import {stateToHTML} from "draft-js-export-html";
import {convertFromRaw} from "draft-js";
import eyeIcon from '../../static/img/eye.svg'
import {getDate, getTime} from "../../helpers/others";

const NewsletterMails = () => {
    const [mails, setMails] = useState([]);
    const [mailVisible, setMailVisible] = useState(-1);

    useEffect(() => {
        getAllNewsletters()
            .then((res) => {
                if(res?.status === 200) {
                    setMails(res?.data?.result);
                }
            });
    }, []);

    return <div className="container container--admin">
        <AdminTop />

        <div className="admin">
            <AdminMenu menuOpen={7} />
            <main className="admin__main admin__main--addonList">
                <h2 className="admin__main__header">
                    Lista wysłanych newsletterów
                </h2>
                {mails?.map((item, index) => {
                    return <div>
                        <section className="admin__main__notification__item" key={index}>
                            <section className="admin__main__notification__item__col col-3">
                                <h3 className="admin__main__notification__item__key">
                                    Tytuł
                                </h3>
                                <h4 className="admin__main__notification__item__value">
                                    {item.title}
                                </h4>
                            </section>
                            <section className="admin__main__notification__item__col col-2">
                                <h3 className="admin__main__notification__item__key">
                                    Data wysłana
                                </h3>
                                <h4 className="admin__main__notification__item__value">
                                    {getDate(item.created_at)}<br/>
                                    {getTime(item.created_at)}
                                </h4>
                            </section>
                            <section className="admin__main__notification__item__col col-4">
                                <h3 className="admin__main__notification__item__key">
                                    Akcje
                                </h3>
                                <section className="admin__main__notification__item__buttons">
                                    <button className="admin__main__notification__item__btn admin__main__notification__item__btn--block"
                                            onClick={() => { setMailVisible(prevState => {
                                                return prevState === index ? -1 : index;
                                            }); }}>
                                        <img className="btn__img" src={eyeIcon} alt="zablokuj" />
                                    </button>
                                </section>
                            </section>
                        </section>

                        {mailVisible === index ? <div className="newsletter__mails__item">
                            <article dangerouslySetInnerHTML={{__html: item.content ? item.content : ''}}>

                            </article>
                        </div> : ''}
                    </div>
                })}
            </main>
        </div>
    </div>
};

export default NewsletterMails;
