import React, {useContext, useEffect, useState} from 'react';
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";

const CartContent = ({nextStep, shippingMethods, shipping, setShipping}) => {
    const { cartContent, removeFromCart, decrementFromCart } = useContext(CartContext);
    const { language, content } = useContext(ContentContext);

    const [cartSum, setCartSum] = useState(0);

    useEffect(() => {
        if(cartContent?.length) {
            setCartSum(cartContent.reduce((prev, curr) => {
                console.log(prev);
                console.log(curr);
                if(curr) {
                    return prev + curr.product.price;
                }
                else {
                    return prev;
                }
            }, 0));
        }
    }, [cartContent]);

    const decrementAmount = (product, addons, amount) => {
        if(amount === -1) {
            removeFromCart(product, addons);
        }
        else {
            decrementFromCart(product, addons);
        }
    }

    const incrementAmount = (slug) => {
        window.location = `/produkt/${slug}`
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

                {cartContent && cartContent?.length ? cartContent?.map((item, index) => {
                    if(item) {
                        const product = item.product;
                        return <div className="cart__table__row flex">
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
                                            <button className="cart__table__amountChange__btn" onClick={() => { incrementAmount(product.slug); }}>
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
                                    <button className="cart__table__amountChange__btn" onClick={() => { incrementAmount(product.slug); }}>
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
                    }
                }) : ''}

            </div>

            <div className="shipping">
                <h3 className="shipping__header">
                    Wybierz metodę dostawy
                </h3>
                {shippingMethods.map((item, index) => {
                    return <button className={shipping === index ? "shipping__method shipping__method--selected" : "shipping__method"}
                                   onClick={() => { setShipping(index); }}>
                        <span className="shipping__method__left">
                            <span className="shipping__method__circle">

                            </span>
                            <img className="shipping__method__img" src={item.icon} alt={item.pl} />
                            <span className="shipping__method__name">
                                {language === 'pl' ? item.pl : item.en}
                            </span>
                        </span>
                        <span className="shipping__method__price">
                            GRATIS
                        </span>
                    </button>
                })}
            </div>
        </div>
        <div className="cart__right">
            <div className="cart__summary">
                <h4 className="cart__summary__header">
                    Podsumowanie
                </h4>
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
