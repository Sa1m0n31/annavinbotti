import React, {useContext} from 'react';
import img1 from '../../static/img/model1.png'
import img2 from '../../static/img/model2.png'
import img3 from '../../static/img/model3.png'
import {ContentContext} from "../../App";

const HomepageModels = () => {
    const { language } = useContext(ContentContext);

    const models = [
        {
            img: img1,
            namePl: 'Buty na obcasie',
            nameEn: 'Boots',
            link: '/sklep'
        },
        {
            img: img2,
            namePl: 'Baleriny',
            nameEn: 'Balerins',
            link: '/sklep'
        },
        {
            img: img3,
            namePl: 'Sandały',
            nameEn: 'Sandals',
            link: '/sklep'
        }
    ]

    return <section className="homepageModels w">
        <h2 className="homepage__header">
            Nasze modele
        </h2>
        <div className="flex">
            {models?.map((item, index) => {
                return <a className="homepageModels__item" key={index} href={item.link}>
                    <figure>
                        <img className="img" src={item.img} alt={item.name} />
                    </figure>
                    <h3 className="homepageModels__item__header">
                        {language === 'pl' ? item.namePl : item.nameEn}
                    </h3>
                </a>
            })}
        </div>
    </section>
};

export default HomepageModels;
