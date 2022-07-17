import React from 'react';
import img1 from '../../static/img/afterSlider1.png'
import img2 from '../../static/img/afterSlider2.png'

const HomepageAfterSlider = () => {
    return <section className="afterSlider w">
        <h2 className="homepage__header">
            Chcesz wiedzieć więcej?
        </h2>
        <div className="flex">
            <a className="afterSlider__item" href="/jak-zamawiac">
                <figure>
                    <img className="img" src={img1} alt="img1" />
                </figure>
                <h3 className="afterSlider__item__header">
                    Jak zamawiać buty?
                </h3>
            </a>
            <a className="afterSlider__item" href="/jak-powstaja">
                <figure>
                    <img className="img" src={img2} alt="img1" />
                </figure>
                <h3 className="afterSlider__item__header">
                    Jak powstają nasze buty?
                </h3>
            </a>
        </div>
    </section>
};

export default HomepageAfterSlider;
