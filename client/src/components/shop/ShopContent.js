import React, {useContext, useEffect, useState} from 'react';
import filterIcon from '../../static/img/filter.svg'
import {getAllProducts} from "../../helpers/products";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const ShopContent = () => {
    const { language, content } = useContext(ContentContext);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getAllProducts()
            .then((res) => {
                setProducts(res?.data?.result);
            });
    }, []);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return <main className="shop">
        <header className="shop__header w flex">
            <h1 className="pageHeading">
                Wszystkie produkty
            </h1>
            <button className="filterBtn">
                <img className="filterIcon" src={filterIcon} alt="filtrowanie" />
                Filtruj
            </button>
        </header>
        <div className="shop__products w flex">
            {products?.map((item, index) => {
                return <div className="shop__products__item"
                          key={index}>
                    <figure className="shop__products__item__imgWrapper">
                        <img className="productImg"
                             src={`${constans.IMAGE_URL}/media/products/${item.main_image}`}
                             alt={item.name_pl} />
                    </figure>

                    <div className="shop__products__item__hover">
                        <h2 className="shop__products__item__header">
                            {language === 'pl' ? item.name_pl : item.name_en}
                        </h2>
                        <h3 className="shop__products__item__price">
                            {item.price} zł
                        </h3>
                        <a href={`/produkt?id=${item.id}`}
                           className="shop__products__item__btn">
                            Zamów
                        </a>
                    </div>
                </div>
            })}
        </div>
    </main>
};

export default ShopContent;
