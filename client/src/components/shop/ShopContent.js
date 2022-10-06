import React, {useContext, useEffect, useRef, useState} from 'react';
import filterIcon from '../../static/img/filter.svg'
import {getShopPage, getTypesWithProducts} from "../../helpers/products";
import constans from "../../helpers/constants";
import {CartContext, ContentContext} from "../../App";
import {
    displayPrice,
    getNumberOfModelsWithTheSameStockInCart,
    getNumberOfOptionInCart,
    isElementInArray, isProductAvailable
} from "../../helpers/others";
import WaitlistModal from "./WaitlistModal";

const ShopContent = () => {
    const { language, content } = useContext(ContentContext);
    const { cartContent } = useContext(CartContext);

    const [currentFilter, setCurrentFilter] = useState([]);
    const [types, setTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsVisible, setProductsVisible] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [waitlistModal, setWaitlistModal] = useState(0);

    const filterSection = useRef(null);
    const productsWrapper = useRef(null);

    useEffect(() => {
        getShopPage()
            .then((res) => {
                setProducts(res?.data?.result);
                setProductsVisible(res?.data?.result);
            });

        getTypesWithProducts()
            .then((res) => {
                if(res?.status === 200) {
                    setTypes(res?.data?.result);
                    setCurrentFilter(res?.data?.result?.map((item) => (item.id)));
                }
            });
    }, []);

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    }

    const filterByCategory = (id) => {
        if(isElementInArray(id, currentFilter)) {
            setCurrentFilter(currentFilter.filter((item) => (item !== id)));
        }
        else {
            setCurrentFilter([...currentFilter, id]);
        }
    }

    useEffect(() => {
        productsWrapper.current.style.opacity = '0';
        setProductsVisible(products?.filter((item) => {
            return isElementInArray(item.type_id, currentFilter);
        }));
        setTimeout(() => {
            productsWrapper.current.style.opacity = '1';
        }, 400);
    }, [currentFilter]);

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

        {waitlistModal ? <WaitlistModal id={waitlistModal}
                                        closeModalFunction={() => { setWaitlistModal(0); }} /> : ''}

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
            {types?.map((item, index) => {
                return <button className={isElementInArray(item.id, currentFilter) ? "filterSection__btn filterSection__btn--selected" : "filterSection__btn"}
                               key={index}
                               onClick={() => { filterByCategory(item.id); }}>
                    {language === 'pl' ? item.name_pl : item.name_en}
                </button>
            })}
        </div>

        <div className="shop__products w flex" ref={productsWrapper}>
            {productsVisible?.map((item, index) => {
                const productNotAvailable = !isProductAvailable(item.addons, item.counter, item.id, item.stock_id, cartContent);

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
                            {displayPrice(item.price)} zł
                        </h3>
                        {productNotAvailable ? <>
                            <h4 className="shop__products__item__notAvailable">
                                Produkt niedostępny
                            </h4>
                            <button onClick={() => { setWaitlistModal(item.id); }}
                               className="shop__products__item__btn shop__products__item__btn--notAvailable">
                                Powiadom o dostępności
                            </button>
                            <a href={`/produkt/${item.slug}`}
                               className="shop__products__item__btn shop__products__item__btn--showModel">
                                Zobacz model
                            </a>
                        </> : <a href={`/produkt/${item.slug}`}
                                   className="shop__products__item__btn">
                            Rezerwuj
                        </a>}
                    </div>
                </div>
            })}
        </div>
    </main>
};

export default ShopContent;
