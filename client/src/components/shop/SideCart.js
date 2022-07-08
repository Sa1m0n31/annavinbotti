import React, {useContext, useEffect, useState} from 'react';
import {CartContext, ContentContext} from "../../App";
import constans from "../../helpers/constants";

const SideCart = () => {
    const { cartContent } = useContext(CartContext);
    const { language, content } = useContext(ContentContext);

    const [cartSum, setCartSum] = useState(null);

    useEffect(() => {
        if(cartContent) {
            setCartSum(cartContent.reduce((prev, curr) => {
                return prev + curr.product.price;
            }, 0));
        }
    }, [cartContent]);

    return <div className="cart__summary">
        <h3 className="cart__summary__header">
            Koszyk
        </h3>

        {cartContent?.map((item, index) => {
            return <div className="cart__summary__item flex" key={index}>
                <figure>
                    <img className="img" src={`${constans.IMAGE_URL}/media/products/${item.product.main_image}`} alt={item.product.name_pl} />
                </figure>
                <div className="cart__summary__item__content">
                    <h4 className="cart__summary__item__content__header">
                        {language === 'pl' ? item.product.name_pl : item.product.name_en}
                    </h4>
                    <p className="cart__summary__item__content__amount">
                        {item.amount} szt
                    </p>
                    <p className="cart__summary__item__content__price">
                        {item.product.price} PLN
                    </p>
                </div>
            </div>
        })}

        <div className="cart__summary__row flex">
            <span>Koszt dostawy</span>
            <span>GRATIS</span>
        </div>
        <div className="cart__summary__row flex">
            <span>Koszt płatności</span>
            <span>GRATIS</span>
        </div>
        <div className="cart__summary__summaryRow flex">
            <span>Razem</span>
            <span>{cartSum} PLN</span>
        </div>
    </div>
};

export default SideCart;
