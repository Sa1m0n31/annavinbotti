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
import draftToHtml from 'draftjs-to-html';
import arrowDownGoldIcon from '../../static/img/arrow-down-gold.svg'
import {addToWaitlist} from "../../helpers/orders";
import {displayPrice, isAddonAvailable, isEmail, isProductAvailable} from "../../helpers/others";
import Slider from "react-slick";
import RedirectionInfoModal from "../../components/shop/RedirectionInfoModal";
import infoIcon from '../../static/img/info-icon.svg'
import LoadingPage from "../../components/shop/LoadingPage";

const settings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false
}

const ProductPage = () => {
    const { language } = useContext(ContentContext);
    const { addToCart, cartContent } = useContext(CartContext);

    const [render, setRender] = useState(false);
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
    const [outOfStock, setOutOfStock] = useState(false);
    const [redirectionInfoModal, setRedirectionInfoModal] = useState(false);
    const [lastClick, setLastClick] = useState(0);

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

        if(localStorage.getItem('redirectionInfoModal') === 'true') {
            setRedirectionInfoModal(true);
            localStorage.removeItem('redirectionInfoModal');
        }
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
                       setGallery([product?.main_image]?.concat(r?.map((item) => {
                           return item.path;
                       })));
                   }
                });

            getProductAddons(id)
                .then((res) => {
                    const r = res?.data?.result;
                    if(r) {
                        const addonsToCheckAvailability = Object.entries(groupBy(r, 'addon_name_pl'))
                            .map((item) => (item[1]))
                            .flat()
                            .map((item) => ({
                                addon_option_id: item.addon_option_id,
                                addon_id: item.id,
                                addon_option_stock: item.stock
                            }));

                        if(!isProductAvailable(addonsToCheckAvailability, product.counter, product.id, product.stock_id, cartContent)) {
                            setAddons(Object.entries(groupBy(r, 'addon_name_pl')).sort((a, b) => {
                                return a[1][0].priority > b[1][0].priority ? 1 : -1;
                            })?.map((item) => {
                                return [
                                    item[0],
                                    item[1]
                                ];
                            }));

                            setWaitlistInputVisible(true);
                            setRender(true);
                        }
                        else {
                            setAddons(Object.entries(groupBy(r, 'addon_name_pl')).sort((a, b) => {
                                return a[1][0].priority > b[1][0].priority ? 1 : -1;
                            })?.map((item) => {
                                return [
                                    item[0],
                                    item[1].filter((item) => {
                                        return isAddonAvailable(item.addon_option_id, item.stock, cartContent);
                                    })
                                ];
                            }));

                            setRender(true);
                        }
                    }
                });
        }
    }, [product]);

    useEffect(() => {
        console.log(addons);
    }, [addons]);

    useEffect(() => {
        console.log(addons);
    }, [addons]);

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

    const changeSelectedAddons = (addon, addon_option, e) => {
        console.log(e);

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

    const buy = async () => {
        const allAddonsSelected = requiredAddons.filter((item) => {
            return !selectedAddons[item];
        }).length === 0;

        if(allAddonsSelected) {
            if(await addToCart(product, Object.fromEntries(Object.entries(selectedAddons).filter((item) => {
                return item[1];
            })))) {
                // Added to cart
                window.location = '/zamowienie';
            }
            else {
                // Product not available
                setOutOfStock(true);
            }
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

    const doubleTap = (e) => {
        e.preventDefault();
        let date = new Date();
        let time = date.getTime();
        const time_between_taps = 200; // 200ms
        if (time - lastClick < time_between_taps) {
            setFullScreenGallery(true);
        }
        setLastClick(time);
    }

    const getGalleryMiniatures = () => {
        return gallery.filter((item, index) => (index !== galleryIndex)).slice(0, 4);
    }

    return render ? <div className="container">
        <PageHeader />
        {loading ? <div className="product--loading center w">
            <Loader />
        </div> : <main className="product w flex">
            {redirectionInfoModal ? <RedirectionInfoModal closeModalFunction={() => { setRedirectionInfoModal(false); } } /> : ''}

            {/* GALLERY */}
            <div className="product__gallery flex">
                <div className="product__gallery__miniatures d-from-900">
                    {getGalleryMiniatures()?.map((item, index) => {
                        return <button className="product__gallery__miniatures__item"
                                       onClick={() => { galleryGoTo(index); }}>
                            <img className="img" src={`${constans.IMAGE_URL}/media/products/${item}`} alt={product?.name_pl} />
                        </button>
                    })}
                </div>
                <div className="product__gallery__main"
                     onDoubleClick={() => { setFullScreenGallery(true); }}
                     onTouchStart={(e) => { doubleTap(e); }}>
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
                    {displayPrice(product?.price)} zł
                </h2>
                <p className="product__shortDesc"
                   dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(
                           language === 'pl' ? product?.description_pl : product?.description_en)
                       )}}
                >

                </p>

                {/* ADDONS */}
                <h3 className="addons__header">
                    Wybierz dodatki
                </h3>
                {addons?.map((item, index) => {
                    console.log(item);
                    const ad = item[1];
                    const conditionIf = ad[0]?.show_if;
                    const conditionIsEqual = ad[0]?.is_equal;

                    if(ad && ((conditionIf && (selectedAddons[conditionIf] === conditionIsEqual)) || (!conditionIf))) {
                        return <div className="addon" key={index}>
                            <h3 className="addon__title">
                                {language === 'pl' ? ad[0]?.addon_name_pl : ad[0]?.addon_name_en}

                                {ad[0].info_pl ? <div className="addon__title__infoBtn">
                                    <img className="img" src={infoIcon} alt="info" />

                                    <div className="addon__option__tooltip">
                                        {ad[0].info_pl}
                                    </div>
                                </div> : ''}
                            </h3>

                            {/* ADDONS OPTIONS */}
                            <div className="addon__options flex">
                                {ad?.map((item, index) => {
                                    return <button className={selectedAddons[item.id] === item.addon_option_id ? (item.addon_type === 1 ? "addon__option addon__option--textType addon__option--selected" : "addon__option addon__option--selected") : (item.addon_type === 1 ? "addon__option addon_option--textType" : "addon__option")}
                                                   key={index}
                                                   onClick={(e) => { changeSelectedAddons(item.id, item.addon_option_id, e); }}>

                                        {!(item.addon_type === 1 && !item.tooltip_pl) ? <div className="addon__option__tooltip">
                                            {item.addon_type === 1 ? <span>
                                                {item.tooltip_pl}
                                            </span> : <>
                                                <figure>
                                                    <img className="img" src={`${constans.IMAGE_URL}/media/addons/${item.image}`} alt="dodatek" />
                                                </figure>
                                                <span>
                                                      {item.tooltip_pl}
                                                </span>
                                            </>}
                                        </div> : ''}

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
                    Dziękujemy za zapisanie się na listę kolejkową. Poinformujemy Cię, gdy produkt będzie dostępny!
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
                        Powiadom o dostępności
                    </button>
                </>) : <>
                    <p className="productContent__info">
                        Rezerwacja produktu oznacza, że masz 7 dni roboczych na
                        podanie wymiarów stopy i przesłanie nam oryginalnych kartek z obrysem stopy prawej
                        i lewej na nasz adres korespondencyjny. Po ich podaniu oraz naszej weryfikacji
                        otrzymasz link do płatności. Zamówienie jest przyjęte do realizacji
                        po zaksięgowaniu płatności.
                    </p>

                    {addonsError ? <p className="info info--error">
                        Wybierz wszystkie dodatki
                    </p> : ''}

                    {outOfStock ? <p className="info info--error">
                        Brak wystarczającej ilości produktu na stanie
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
                __html: draftToHtml(JSON.parse(
                    language === 'pl' ? product?.details_pl : product?.details_en)
                )
            }}>

            </div>
        </section>}
        <Footer />
    </div> : <LoadingPage />
};

export default ProductPage;
