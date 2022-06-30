import React, {useRef} from 'react';
import Slider from 'react-slick'
import sliderImg from '../../static/img/slider.png'
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
        autoplaySpeed: 3000
    };

    const sliderRef = useRef(null);

    const slider = [
        {
            image: sliderImg,
            link: '/sklep'
        },
        {
            image: sliderImg,
            link: '/sklep'
        },
        {
            image: sliderImg,
            link: '/sklep'
        },
        {
            image: sliderImg,
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
