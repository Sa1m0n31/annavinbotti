import React, {useContext, useEffect, useRef, useState} from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import {getProductAddons, getProductBySlug, getProductGallery} from "../../helpers/products";
import constans from "../../helpers/constants";
import arrowLeft from '../../static/img/arrow-left.svg'
import arrowRight from '../../static/img/arrow-right.svg'
import largeImgIcon from '../../static/img/large-image.svg'
import Loader from "../../components/shop/Loader";
import {CartContext, ContentContext} from "../../App";
import { convertFromRaw } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import arrowDownGoldIcon from '../../static/img/arrow-down-gold.svg'
import {addToWaitlist} from "../../helpers/orders";
import {isEmail} from "../../helpers/others";
import Slider from "react-slick";

const settings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false
}

const ProductPage = () => {
    const { content, language } = useContext(ContentContext);
    const { addToCart } = useContext(CartContext);

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [gallery, setGallery] = useState([]);
    const [addons, setAddons] = useState([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [selectedAddons, setSelectedAddons] = useState({});
    const [requiredAddons, setRequiredAddons] = useState([]);
    const [email, setEmail] = useState("");
    const [waitlistInputVisible, setWaitlistInputVisible] = useState(false);
    const [addonsError, setAddonsError] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [fullScreenGallery, setFullScreenGallery] = useState(false);

    const sliderRef = useRef(null);
    const sliderGalleryRef = useRef(null);

    useEffect(() => {
        const urlArray = window.location.href.split('/');
        const slug = urlArray[urlArray.length-1];

        getProductBySlug(slug)
            .then((res) => {
                const r = res?.data?.result;
                if(r) {
                    setProduct(r[0]);
                }
            })
            .catch((err) => {
               window.location = '/sklep';
            });
    }, []);

    useEffect(() => {
        const id = product?.id;
        if(id) {
            if(product?.addons_not_available !== '0' || parseInt(product?.counter) <= 0) {
                setWaitlistInputVisible(true);
            }

            getProductGallery(id)
                .then((res) => {
                   setLoading(false);
                   const r = res?.data?.result;
                   if(r) {
                       setGallery(r?.map((item) => {
                           return item.path;
                       }));
                   }
                });

            getProductAddons(id)
                .then((res) => {
                    const r = res?.data?.result;
                    if(r) {
                        setAddons(Object.entries(groupBy(r, 'addon_name_pl')).sort((a, b) => {
                            return a[1][0].priority > b[1][0].priority ? 1 : -1;
                        }));
                    }
                });
        }
    }, [product]);

    const convertArrayToObject = (array) => {
        const initialValue = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[1][0]['id']]: null,
            };
        }, initialValue);
    };

    useEffect(() => {
        if(addons) {
            setRequiredAddons(addons?.filter((item) => {
                return !item[1][0].show_if;
            })?.map((item) => {
                return item[1][0].id
            }));
            setSelectedAddons(convertArrayToObject(addons));
        }
    }, [addons]);

    const groupBy = (items, key) => items.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: [
                ...(result[item[key]] || []),
                item,
            ],
        }),
        {},
    )

    const prevImage = () => {
        setGalleryIndex(galleryIndex === 0 ? gallery?.length-1 : galleryIndex-1);
    }

    const nextImage = () => {
        setGalleryIndex(galleryIndex === gallery?.length-1 ? 0 : galleryIndex+1)
    }

    const galleryGoTo = (i) => {
        setGalleryIndex(i);
    }

    const isElementInArray = (arr, el) => {
        return arr.findIndex((item) => {
            return item === el;
        }) !== -1;
    }

    const changeSelectedAddons = (addon, addon_option) => {
        setRequiredAddons(addons?.filter((item) => {
            const showIf = item[1][0].show_if;
            const isEqual = item[1][0].is_equal;

            if(showIf === addon) {
                /* If user changed addon that determine condition */
                return !showIf || (showIf === addon && isEqual === addon_option);
            }
            else {
                /* Else - show if addon has not got condition or is already available in requiredAddons */
                return !showIf || isElementInArray(requiredAddons, item[1][0].id);
            }
        })?.map((item) => {
            return item[1][0].id;
        }));
        setSelectedAddons({
            ...selectedAddons,
            [addon]: addon_option
        });
    }

    const goToDetails = () => {
        document.getElementById('productDetails').scrollIntoView({
            behavior: 'smooth'
        });
    }

    const validateAddons = () => {
        return requiredAddons.filter((item) => {
            return selectedAddons[item];
        })?.length === requiredAddons?.length;
    }

    const buy = () => {
        if(validateAddons()) {
            addToCart(product, Object.fromEntries(Object.entries(selectedAddons).filter((item) => {
                return item[1];
            })));
            window.location = '/zamowienie';
        }
        else {
            setAddonsError(true);
        }
    }

    const waitlist = () => {
        if(isEmail(email)) {
            addToWaitlist(product.id, email)
                .then((res) => {
                    if(res?.status === 201) {
                        setWaitlistSuccess(true);
                    }
                    else {
                        if(res?.data?.result === -1) {
                            setEmailError(language === 'pl' ? 'Podany adres e-mail jest już zapisany na tę listę kolejkową' : 'That email is already on waitlist');
                        }
                        else {
                            setEmailError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN)
                        }
                    }
                })
                .catch(() => {
                    setEmailError(language === 'pl' ? constans.ERROR_PL : constans.ERROR_EN);
                })
        }
        else {
            setEmailError('Wpisz poprawny adres e-mail');
        }
    }

    useEffect(() => {
        if(sliderGalleryRef?.current) {
            sliderGalleryRef.current.slickGoTo(galleryIndex);
        }
    }, [galleryIndex]);

    useEffect(() => {
        if(sliderRef?.current) {
            if(fullScreenGallery) {
                sliderGalleryRef.current.slickGoTo(galleryIndex);
                sliderRef.current.style.zIndex = '100';
                sliderRef.current.style.opacity = '1';
            }
            else {
                sliderRef.current.style.opacity = '0';
                setTimeout(() => {
                    sliderRef.current.style.zIndex = '-1';
                }, 400);
            }
        }
    }, [fullScreenGallery]);

    return <div className="container">
        <PageHeader />
        {loading ? <div className="product--loading center w">
            <Loader />
        </div> : <main className="product w flex">
            {/* GALLERY */}
            <div className="product__gallery flex">
                <div className="product__gallery__miniatures d-from-900">
                    {gallery?.map((item, index) => {
                        if(index !== galleryIndex) {
                            return <button className="product__gallery__miniatures__item" onClick={() => { galleryGoTo(index); }}>
                                <img className="img" src={`${constans.IMAGE_URL}/media/products/${item}`} alt={product?.name_pl} />
                            </button>
                        }
                    })}
                </div>
                <div className="product__gallery__main">
                    <button className="product__gallery__btn product__gallery__btn--prev" onClick={() => { prevImage(); }}>
                        <img className="img" src={arrowLeft} alt="poprzednie" />
                    </button>
                    {gallery?.map((item, index) => {
                        return <figure key={index} className={index === galleryIndex ? "product__gallery__main__figure" : "product__gallery__main__figure product__gallery__main__figure--hidden"}>
                            <img className="img" src={`${constans.IMAGE_URL}/media/products/${item}`} alt={product?.name_pl} />
                        </figure>
                    })}
                    <button className="product__gallery__btn product__gallery__btn--next" onClick={() => { nextImage(); }}>
                        <img className="img" src={arrowRight} alt="nastepne" />
                    </button>

                    <button className="product__gallery__btn product__gallery__btn--large d-from-900"
                            onClick={() => { setFullScreenGallery(true); }}>
                        <img className="img" src={largeImgIcon} alt="pelny-ekran" />
                    </button>
                </div>
            </div>

            {/* FULL SCREEN GALLERY */}
            <div className="fullScreenGallery" ref={sliderRef}>
                <button className="fullScreenGallery__close"
                        onClick={() => { setFullScreenGallery(false); }}>
                    &times;
                </button>
                <div className="fullScreenGallery__inner">
                    <Slider ref={sliderGalleryRef} {...settings}>
                        {gallery?.map((item, index) => {
                            return <div className="fullScreenGallery__item center" key={index}>
                                <img className="img" src={`${constans.IMAGE_URL}/media/products/${item}`} alt={product?.name_pl} />
                            </div>
                        })}
                    </Slider>
                </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="product__content">
                <h1 className="product__title">
                    {language === 'pl' ? product?.name_pl : product?.name_en}
                </h1>
                <h2 className="product__price">
                    {product?.price} zł
                </h2>
                <p className="product__shortDesc"
                    dangerouslySetInnerHTML={{__html: stateToHTML((convertFromRaw(JSON.parse(
                            language === 'pl' ? product?.description_pl : product?.description_en)
                        )))}}
                >

                </p>

                {/* ADDONS */}
                {addons?.map((item, index) => {
                    const ad = item[1];
                    const conditionIf = ad[0].show_if;
                    const conditionIsEqual = ad[0].is_equal;
                    if(ad && (conditionIf && (selectedAddons[conditionIf] === conditionIsEqual)) || (!conditionIf)) {
                        return <div className="addon" key={index}>
                            <h3 className="addon__title">
                                {language === 'pl' ? ad[0]?.addon_name_pl : ad[0]?.addon_name_en}
                            </h3>

                            {/* ADDONS OPTIONS */}
                            <div className="addon__options flex">
                                {ad?.map((item, index) => {
                                    return <button className={selectedAddons[item.id] === item.addon_option_id ? "addon__option addon__option--selected" : "addon__option"}
                                                   key={index}
                                                   onClick={() => { changeSelectedAddons(item.id, item.addon_option_id); }}>
                                                    {item.addon_type === 1 ? <span className="addon__option__textType">
                                                {language === 'pl' ? item.addon_option_name_pl : item.addon_option_name_en}
                                            </span> : <span className="addon__option__imageType">
                                                <figure>
                                                    <img className="img" src={`${constans.IMAGE_URL}/media/addons/${item.image}`} alt="dodatek" />
                                                </figure>
                                                <span>
                                                    {language === 'pl' ? item.addon_option_name_pl : item.addon_option_name_en}
                                                </span>
                                        </span>}
                                    </button>
                                })}
                            </div>
                        </div>
                    }
                })}

                {waitlistInputVisible ? (waitlistSuccess ? <span className="info info--waitlist">
                    Dziękujemy za zapisanie się na listę kolejkową! Poinformujemy Cię model, gdy produkt będzie dostępny!
                </span> : <>
                    <label className="waitlistLabel">
                        Wpisz swój adres e-mail, a my powiadomimy Cię, gdy produkt będzie dostępny
                        <input className="input"
                               placeholder="Adres e-mail"
                               value={email}
                               onChange={(e) => { setEmail(e.target.value); }} />
                    </label>
                    {emailError ? <span className="info info--error info--error--waitlist">
                        {emailError}
                    </span> : ''}
                    <button className="btn btn--productContent btn--waitlist" onClick={() => { waitlist(); }}>
                        Zapisz się na waitlistę
                    </button>
                </>) : <>
                    <p className="productContent__info">
                        Rezerwacja produktu oznacza, że masz 7 dni kalendarzowych na podanie wymiarów stopy. Po ich podaniu oraz naszej weryfikacji otrzymasz link do płatności. Zamówienie jest przyjęte do realizacji po zaksięgowaniu płatności.
                    </p>

                    {addonsError ? <p className="info info--error">
                        Wybierz wszystkie dodatki
                    </p> : ''}

                    <button className="btn btn--productContent" onClick={() => { buy(); }}>
                        Rezerwuję
                    </button>
                </>}

                <button className="product__productDetailsBtn d-from-900" onClick={() => { goToDetails(); }}>
                    <span className="product__productDetailsBtn__text">
                        Szczegóły produktu
                    </span>
                    <span className="product__productDetailsBtn__imgWrapper">
                        <img className="img" src={arrowDownGoldIcon} alt="nizej" />
                        <img className="img" src={arrowDownGoldIcon} alt="nizej" />
                    </span>
                </button>
            </div>
        </main>}

        {loading ? '' : <section className="productDetails" id="productDetails">
            <h4 className="productDetails__header">
                Opis produktu
            </h4>
            <div dangerouslySetInnerHTML={{
                __html: stateToHTML((convertFromRaw(JSON.parse(
                    language === 'pl' ? product?.details_pl : product?.details_en)
                )))
            }}>

            </div>
        </section>}
        <Footer />
    </div>
};

export default ProductPage;
