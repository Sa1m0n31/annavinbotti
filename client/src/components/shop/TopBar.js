import React, {useContext} from 'react';
import instagramIcon from '../../static/img/instagram.svg'
import facebookIcon from '../../static/img/facebook.svg'
import constans from "../../helpers/constants";
import {ContentContext} from "../../App";

const TopBar = () => {
    const { language, setLanguage } = useContext(ContentContext);

    return <aside className="topBar d-desktop">
        <div className="w flex">
            <div className="flex topBar__socialMedia">
                <a className="topBar__socialMedia__link" href={constans.FACEBOOK_LINK} target="_blank">
                    <img className="img" src={facebookIcon} alt="facebook" />
                </a>
                <a className="topBar__socialMedia__link" href={constans.INSTAGRAM_LINK} target="_blank">
                    <img className="img" src={instagramIcon} alt="instagram" />
                </a>
            </div>

            <div className="topBar__languageSwitcher">
                <span className="topBar__languageSwitcher__currentLanguage">
                    <span>
                        {language === 'pl' ? 'polski' : 'angielski'}
                    </span>
                </span>
                <button className="topBar__languageSwitcher__secondLanguage" onClick={() => { setLanguage(language === 'pl' ? 'en' : 'pl') }}>
                    {language === 'pl' ? 'angielski' : 'polski'}
                </button>
            </div>
        </div>
    </aside>
};

export default TopBar;
