import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import Footer from "../../components/shop/Footer";
import img1 from '../../static/img/example1-min.JPG';
import img2 from '../../static/img/example2-min.JPG';
import img3 from '../../static/img/example3-min.JPG';

const ExamplePage1 = () => {
    return <div className="container">
        <PageHeader />
        <main className="faq w">
            <h1 className="pageHeader">
                Formularz weryfikacji buta do miary - przykład
            </h1>
            <div className="flex flex--mobile">
                <div className="example__item">
                    <figure className="example__img">
                        <img className="img" src={img2} alt="przyklad" />
                    </figure>
                    <h4 className="example__header">
                        Zdjęcie od boku zewnętrznego
                    </h4>
                </div>
                <div className="example__item">
                    <figure className="example__img">
                        <img className="img" src={img1} alt="przyklad" />
                    </figure>
                    <h4 className="example__header">
                        Zdjęcie od góry
                    </h4>
                </div>
                <div className="example__item">
                    <figure className="example__img">
                        <img className="img" src={img3} alt="przyklad" />
                    </figure>
                    <h4 className="example__header">
                        Zdjęcie od boku wewnętrznego
                    </h4>
                </div>
            </div>
        </main>
        <Footer />
    </div>
};

export default ExamplePage1;
