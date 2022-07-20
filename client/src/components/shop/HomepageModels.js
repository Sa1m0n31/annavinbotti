import React, {useContext, useEffect, useState} from 'react';
import {ContentContext} from "../../App";
import {getHomepageModels} from "../../helpers/products";
import constans from "../../helpers/constants";

const HomepageModels = () => {
    const { language } = useContext(ContentContext);

    const [models, setModels] = useState([]);

    useEffect(() => {
        getHomepageModels()
            .then((res) => {
                if(res?.status) {
                    setModels(res?.data?.result?.map((item) => {
                        return {
                            img: item.main_image,
                            namePl: item.name_pl,
                            nameEn: item.name_en,
                            link: `/produkt/${item.slug}`
                        }
                    }));
                }
            });
    }, []);

    return <section className="homepageModels w">
        <h2 className="homepage__header">
            Nasze modele
        </h2>
        <div className="flex">
            {models?.map((item, index) => {
                return <a className="homepageModels__item"
                          key={index}
                          href={item.link}>
                    <figure>
                        <img className="img" src={`${constans.IMAGE_URL}/media/products/${item.img}`} alt={item.name} />
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
