import React, {useContext} from 'react';
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";

const CartContent = () => {
    const { cartContent, addToCart, removeFromCart } = useContext(CartContext);
    const { language, content } = useContext(ContentContext);

    const decrementAmount = (product, addons, amount) => {
        if(amount === -1) {
            removeFromCart(product, addons);
        }
        else {
            addToCart(product, addons, amount);
        }
    }

    const incrementAmount = (product, addons) => {
        addToCart(product, addons);
    }

    return <div className="order__main flex w order__main--cart">
        <div className="cart__left">
            <div className="cart__table">
                <div className="cart__table__header flex">
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
                                {language === 'pl' ? product.name_pl : product.name_en}
                            </span>
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
                                    <button className="cart__table__amountChange__btn" onClick={() => { incrementAmount(product, item.addons); }}>
                                        +
                                    </button>
                                </div>
                            </span>
                            <span className="cart__table__cell cart__table__cell--3">
                                {product.price * item.amount} zł
                            </span>
                        </div>
                    }
                }) : ''}

            </div>
        </div>
        <div className="cart__right">

        </div>
    </div>
};

export default CartContent;
