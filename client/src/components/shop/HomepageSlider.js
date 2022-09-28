import React, {useRef} from 'react';
import Slider from 'react-slick'
import slider1 from '../../static/img/slider1.jpg'
import slider2 from '../../static/img/slider2.jpg'
import slider3 from '../../static/img/slider3.jpg'
import slider4 from '../../static/img/slider4.jpg'
import slider5 from '../../static/img/slider5.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomepageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 900,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false,
        waitForAnimate: true,
        autoplay: true,
        autoplaySpeed: 5000
    };

    const sliderRef = useRef(null);

    const slider = [
        {
            image: slider1,
            link: '/sklep'
        },
        {
            image: slider2,
            link: '/sklep'
        },
        {
            image: slider3,
            link: '/sklep'
        },
        {
            image: slider4,
            link: '/sklep'
        },
        {
            image: slider5,
            link: '/sklep'
        }
    ]

    return <div className="homepageSlider">
        <Slider ref={sliderRef} {...settings}>
            {slider?.map((item, index) => {
                return <a className="homepageSlider__item" href={item.link}>
                    <img className="img" src={item.image} alt={item.link} />
                </a>
            })}
        </Slider>
    </div>
};

export default HomepageSlider;
