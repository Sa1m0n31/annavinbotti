import React from 'react';
import PageHeader from "../../components/shop/PageHeader";
import HomepageSlider from "../../components/shop/HomepageSlider";
import HomepageAfterSlider from "../../components/shop/HomepageAfterSlider";
import HomepageModels from "../../components/shop/HomepageModels";
import NewsletterSection from "../../components/shop/NewsletterSection";
import Footer from "../../components/shop/Footer";

const Homepage = () => {
    return <div className="container container--home">
        <PageHeader />
        <HomepageSlider />
        <HomepageAfterSlider />
        <HomepageModels />
        <NewsletterSection />
        <Footer />
    </div>
};

export default Homepage;
