import React, {useContext, useEffect, useRef, useState} from 'react';
import filterIcon from '../../static/img/filter.svg'
import {getAllProducts, getShopPage} from "../../helpers/products";
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const ShopContent = () => {
    const { language, content } = useContext(ContentContext);

    const [products, setProducts] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);

    const filterSection = useRef(null);

    useEffect(() => {
        getShopPage()
            .then((res) => {
                setProducts(res?.data?.result);
            });
    }, []);

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    }

    const filterByCategory = (id) => {

    }

    useEffect(() => {
        if(filterVisible) {
            filterSection.current.style.height = 'auto';
            filterSection.current.style.paddingBottom = '40px';
            filterSection.current.style.marginTop = '-20px';

            setTimeout(() => {
                filterSection.current.style.opacity = '1';
            }, 300);
        }
        else {
            filterSection.current.style.opacity = '0';
            setTimeout(() => {
                filterSection.current.style.height = '0';
                filterSection.current.style.paddingBottom = '0';
                filterSection.current.style.marginTop = '-20px';
            }, 300);
        }
    }, [filterVisible]);

    return <main className="shop">
        <header className="shop__header w flex">
            <h1 className="pageHeading">
                Wszystkie produkty
            </h1>
            <button className="filterBtn" onClick={() => { toggleFilter(); }}>
                <img className="filterIcon" src={filterIcon} alt="filtrowanie" />
                Filtruj
            </button>
        </header>
        <div className="filterSection w" ref={filterSection}>
            <button className="filterSection__btn" onClick={() => { filterByCategory(1); }}>
                Czółenka
            </button>
            <button className="filterSection__btn" onClick={() => { filterByCategory(2); }}>
                Oficerki
            </button>
        </div>

        <div className="shop__products w flex">
            {products?.map((item, index) => {
                const productNotAvailable = parseInt(item.addons_not_available) !== 0 || item.counter <= 0;

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
                        {productNotAvailable ? <h4 className="shop__products__item__notAvailable">
                            Produkt niedostępny
                        </h4> : ''}
                        <a href={`/produkt/${item.slug}`}
                           className={productNotAvailable ? "shop__products__item__btn shop__products__item__btn--notAvailable" : "shop__products__item__btn"}>
                            {productNotAvailable ? 'Powiadom o dostępności' : 'Rezerwuj'}
                        </a>
                    </div>
                </div>
            })}
        </div>
    </main>
};

export default ShopContent;
