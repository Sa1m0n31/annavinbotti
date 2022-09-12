import React, {useContext, useEffect, useState} from 'react';
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";
import {getAddonsWithOptions, getProductAddons} from "../../helpers/products";
import {groupBy, isElementInArray, isProductAvailable} from "../../helpers/others";

const CartContent = ({nextStep}) => {
    const { cartContent, removeFromCart, decrementFromCart } = useContext(CartContext);
    const { language } = useContext(ContentContext);

    const [cartSum, setCartSum] = useState(0);
    const [addonsWithOptions, setAddonsWithOptions] = useState([]);
    const [cartAddonsNames, setCartAddonsNames] = useState([]);
    const [productsAddons, setProductsAddons] = useState([]);

    useEffect(() => {
        if(cartContent?.length) {
            setCartSum(cartContent.reduce((prev, curr) => {
                if(curr) {
                    return prev + curr.product.price * curr.amount;
                }
                else {
                    return prev;
                }
            }, 0));

            const addonsIds = cartContent.map((item) => {
                return Object.entries(item.addons).map((item) => (item[0]));
            });

            getAddonsWithOptions(addonsIds)
                .then((res) => {
                   if(res?.status === 200) {
                       setAddonsWithOptions(res?.data?.result);
                   }
                });
        }
    }, [cartContent]);

    useEffect( () => {
        if(cartContent?.length) {
            const getProductsAddons = async () => {
                let tmpAddons = [];
                for(const cartItem of cartContent) {
                    const r = await getProductAddons(cartItem.product.id);
                    console.log(r);

                    if(r) {
                        if(tmpAddons.findIndex((item) => (item.product === cartItem.product.id)) === -1) {
                            tmpAddons.push({
                                product: cartItem.product.id,
                                addons: Object.entries(groupBy(r.data.result, 'addon_name_pl'))
                                    .map((item) => (item[1]))
                                    .flat()
                                    .map((item) => ({
                                        addon_option_id: item.addon_option_id,
                                        addon_id: item.id,
                                        addon_option_stock: item.stock
                                    }))
                            });
                        }
                    }
                }

                setProductsAddons(tmpAddons);
            }

            getProductsAddons();
        }
    }, [cartContent]);

    useEffect(() => {
        console.log(productsAddons);
    }, [productsAddons]);

    useEffect(() => {
        if(addonsWithOptions?.length && cartContent?.length) {
            setCartAddonsNames(cartContent.map((item, index) => {
                return {
                    id: item.product.id,
                    names: Object.entries(item.addons)
                        .map((item) => (item[0]))
                        .map((item) => {
                            const addonId = item;
                            return addonsWithOptions.find((item) => (item.addon_id === parseInt(addonId)))?.addon_name
                    }),
                    options: Object.entries(item.addons)
                        .map((item) => (item[1]))
                        .map((item) => {
                            const addonOptionId = item;
                            return addonsWithOptions.find((item) => (item.addon_option_id === addonOptionId))?.addon_option_name
                        })
                }
            }));
        }
    }, [addonsWithOptions, cartContent]);

    const decrementAmount = (product, addons, amount) => {
        if(amount === -1) {
            removeFromCart(product, addons);
        }
        else {
            decrementFromCart(product, addons);
        }
    }

    const incrementAmount = (slug) => {
        localStorage.setItem('redirectionInfoModal', 'true');
        window.location = `/produkt/${slug}`;
    }

    const removeItemFromCart = (product, addons) => {
        removeFromCart(product, addons);
    }

    return <div className="order__main flex w order__main--cart">
        <div className="cart__left">
            <div className="cart__table">
                <div className="cart__table__header flex d-desktop">
                    <span className="cart__table__cell cart__table__cell--0">
                        Produkt
                    </span>
                    <span className="cart__table__cell cart__table__cell--1">
                        Cena
                    </span>
                    <span className="cart__table__cell cart__table__cell--2">
                        Ilość
                    </span>
                    <span className="cart__table__cell cart__table__cell--3">
                        Razem
                    </span>
                </div>

                {cartContent?.length && productsAddons?.length ? cartContent?.map((item, index) => {
                    if(item) {
                        const product = item.product;
                        const productAvailable = isProductAvailable(productsAddons.find((item) => (item.product === product.id))?.addons, product.counter, product.id, item.stockId, cartContent);

                        return <div key={index}>
                            <div className="cart__table__row flex">
                            <span className="cart__table__cell cart__table__cell--image cart__table__cell--0">
                                <figure>
                                    <img className="img" src={`${constans.IMAGE_URL}/media/products/${product.main_image}`} alt={product.name_pl} />
                                </figure>
                                <span className="d-desktop">
                                    {language === 'pl' ? product.name_pl : product.name_en}
                                </span>
                                <div className="d-mobile">
                                    {language === 'pl' ? product.name_pl : product.name_en}
                                    <span className="cart__table__cell cart__table__cell--1">
                                    {product.price} PLN
                                    </span>
                                    <span className="cart__table__cell cart__table__cell--2">
                                        <div className="cart__table__amountChange flex">
                                            <button className="cart__table__amountChange__btn" onClick={() => { decrementAmount(product, item.addons, item.amount - 1 > 0 ? item.amount - 1 : -1); }}>
                                                -
                                            </button>
                                            <div className="cart__table__amountChange__amount">
                                                {item.amount}
                                            </div>
                                            <button className="cart__table__amountChange__btn"
                                                    disabled={!productAvailable}
                                                    onClick={() => { incrementAmount(product.slug); }}>
                                                +
                                            </button>
                                        </div>
                                    </span>
                                </div>
                            </span>
                                <span className="cart__table__cell cart__table__cell--1 d-desktop">
                                {product.price} PLN
                            </span>
                                <span className="cart__table__cell cart__table__cell--2 d-desktop">
                                <div className="cart__table__amountChange flex">
                                    <button className="cart__table__amountChange__btn" onClick={() => { decrementAmount(product, item.addons, item.amount - 1 > 0 ? item.amount - 1 : -1); }}>
                                        -
                                    </button>
                                    <div className="cart__table__amountChange__amount">
                                        {item.amount}
                                    </div>
                                    <button className="cart__table__amountChange__btn"
                                            disabled={!productAvailable}
                                            onClick={() => { incrementAmount(product.slug); }}>
                                        +
                                    </button>
                                </div>
                            </span>
                                <span className="cart__table__cell cart__table__cell--3 d-desktop">
                                {product.price * item.amount} zł
                            </span>

                                <button className="cart__table__remove" onClick={() => { removeItemFromCart(product, item.addons) }}>
                                    &times;
                                </button>
                            </div>
                            {cartAddonsNames?.length ? <div className="cart__table__addons">
                                {cartAddonsNames[index].names.map((item, addonIndex) => {
                                    return <p className="cart__table__addons__item" key={addonIndex}>
                                        <span className="bold">
                                            {item}:
                                        </span>
                                        <span>
                                            {cartAddonsNames[index].options[addonIndex]}
                                        </span>
                                    </p>
                                })}
                            </div> : ''}
                        </div>
                    }
                }) : ''}

            </div>

            {/*<div className="shipping">*/}
            {/*    <h3 className="shipping__header">*/}
            {/*        Wybierz metodę dostawy*/}
            {/*    </h3>*/}
            {/*    {shippingMethods.map((item, index) => {*/}
            {/*        return <button className={shipping === index ? "shipping__method shipping__method--selected" : "shipping__method"}*/}
            {/*                       onClick={() => { setShipping(index); }}>*/}
            {/*            <span className="shipping__method__left">*/}
            {/*                <span className="shipping__method__circle">*/}

            {/*                </span>*/}
            {/*                <img className="shipping__method__img" src={item.icon} alt={item.pl} />*/}
            {/*                <span className="shipping__method__name">*/}
            {/*                    {language === 'pl' ? item.pl : item.en}*/}
            {/*                </span>*/}
            {/*            </span>*/}
            {/*            <span className="shipping__method__price">*/}
            {/*                GRATIS*/}
            {/*            </span>*/}
            {/*        </button>*/}
            {/*    })}*/}
            {/*</div>*/}
        </div>
        <div className="cart__right">
            <div className="cart__summary">
                <h4 className="cart__summary__header">
                    Podsumowanie
                </h4>
                <div className="cart__summary__row flex">
                    <span>Metoda dostawy</span>
                    <span>Kurier</span>
                </div>
                <div className="cart__summary__row flex">
                    <span>Koszt dostawy</span>
                    <span>Gratis</span>
                </div>
                <div className="cart__summary__row flex">
                    <span>Wartość produktów</span>
                    <span>{cartSum} PLN</span>
                </div>
                <div className="cart__summary__summaryRow flex">
                    <span>Razem</span>
                    <span>{cartSum} PLN</span>
                </div>
                <button className="btn btn--cart" onClick={() => { nextStep(); }}>
                    Przejdź do kasy
                </button>
            </div>
        </div>
    </div>
};

export default CartContent;
