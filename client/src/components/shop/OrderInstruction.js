import React from 'react';
import icon1 from '../../static/img/info-1.svg'
import icon2 from '../../static/img/info-2.svg'
import icon3 from '../../static/img/info-3.svg'
import icon4 from '../../static/img/info-4.svg'
import icon5 from '../../static/img/info-5.svg'
import icon6 from '../../static/img/info-6.svg'
import icon7 from '../../static/img/info-7.svg'
import icon8 from '../../static/img/info-8.svg'
import icon9 from '../../static/img/info-9.svg'
import icon10 from '../../static/img/info-10.svg'
import arrow from '../../static/img/info-arrow.svg'

const OrderInstruction = () => {
    return <div className="instruction instruction--order">
        <div className="instruction__row flex">
            <img className="img" src={icon1} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img" src={icon2} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img img--bigger" src={icon3} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img" src={icon4} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img" src={icon5} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
        </div>
        <div className="instruction__row flex">
            <img className="img" src={icon6} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img" src={icon7} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img img--bigger img--bigger--2" src={icon8} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img img--bigger" src={icon9} alt="instrukcja" />
            <img className="img--icon" src={arrow} alt="strzalka" />
            <img className="img" src={icon10} alt="instrukcja" />
        </div>
    </div>
};

export default OrderInstruction;
