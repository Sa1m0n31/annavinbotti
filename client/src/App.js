import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, {useEffect, useState} from "react";

import 'react-tippy/dist/tippy.css'
import './static/style/style.css'
import './static/style/admin.css'
import './static/style/mobile.css'
import './static/style/mobile-admin.css'

import 'react-upload-gallery/dist/style.css'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminWrapper from "./components/admin/AdminWrapper";
import Homepage from "./pages/shop/Homepage";
import LoadingPage from "./components/shop/LoadingPage";
import Shop from "./pages/shop/Shop";
import LoginAndRegister from "./pages/shop/LoginAndRegister";
import ClientPanel from "./pages/shop/ClientPanel";
import ProductPage from "./pages/shop/ProductPage";
import ShippingFormPage from "./pages/shop/ShippingFormPage";
import OrderDetails from "./pages/shop/OrderDetails";
import FormType1 from "./pages/shop/FormType1";
import FormType2 from "./pages/shop/FormType2";
import PaymentPage from "./pages/shop/PaymentPage";
import ContactPage from "./pages/shop/ContactPage";
import BlogPage from "./pages/shop/BlogPage";
import BlogPost from "./pages/shop/BlogPost";
import RemindPassword from "./pages/shop/RemindPassword";
import AccountVerification from "./pages/shop/AccountVerification";
import AfterRegister from "./pages/shop/AfterRegister";
import NewPasswordForm from "./pages/shop/NewPasswordForm";
import NewsletterVerification from "./pages/shop/NewsletterVerification";
import Faq from "./pages/shop/FAQ";
import Page from "./pages/shop/Page";
import Page3Addon from "./components/shop/Page3Addon";
import {getProductStock} from "./helpers/stocks";

const LanguageContext = React.createContext({
  language: localStorage.getItem('lang') || 'pl',
  setLanguage: () => {}
});

const ContentContext = React.createContext(null);
const CartContext = React.createContext(null);

function App() {
  {/* CART */}
  const [cartContent, setCartContent] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);

  useEffect(() => {
    if(cartContent?.findIndex((item) => {
      return !item || item === 'null';
    }) !== -1) {
      setCartContent(cartContent.filter((item) => {
        return item;
      }));
    }
  }, [cartContent]);

  const addToCart = async (product, addons, amount = false) => {
    // Check if identical product in cart exists
    const addedProductIndex = cartContent?.findIndex((item) => {
      return JSON.stringify(product) === JSON.stringify(item.product) && JSON.stringify(addons) === JSON.stringify(item.addons)
    });

    const res = await getProductStock(product.id)
    const productCount = res?.data?.result[0]?.product_counter !== null ? res?.data?.result[0]?.product_counter : 999999;
    const addonCount = res?.data?.result[0]?.addon_counter !== null ? res?.data?.result[0]?.addon_counter : 999999;

    if(addedProductIndex !== -1) {
      /* Change product amount - Found identical product in cart (same product and addons) */
      if(Math.min(productCount, addonCount) > cartContent[addedProductIndex].amount) {
          // If stock OK - increment product
          cartContent[addedProductIndex] = { ...cartContent[addedProductIndex], amount: cartContent[addedProductIndex].amount + 1 };
          localStorage.setItem('cart', JSON.stringify(cartContent));
          return true;
        }
      else {
          return false;
      }
    }
    else {
      /* Add new product */
      const amountInCart = cartContent.filter((item) => {
        return item.product.id === product.id;
      }).reduce((prev, curr) => {
        return prev + curr?.amount;
      }, 0);

      if(Math.min(productCount, addonCount) >= amountInCart + 1) {
        localStorage.setItem('cart', JSON.stringify([...cartContent, {
          product, addons, amount: 1
        }]));

        setCartContent([...cartContent, {
          product, addons, amount: 1
        }]);

        return true;
      }
      else {
        return false;
      }
    }
  }

  const decrementFromCart = (product, addons) => {
    const localStorageItem = localStorage.getItem('cart');

    if(localStorageItem) {
      const newCart = JSON.parse(localStorage.getItem('cart'))
          .map((item) => {
            if(JSON.stringify(item.product) === JSON.stringify(product) && JSON.stringify(item.addons) === JSON.stringify(addons)) {
              return {
                ...item, amount: item.amount - 1
              }
            }
            else {
              return item;
            }
          });

      setCartContent(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }

  const removeFromCart = (product, addons) => {
    const localStorageItem = localStorage.getItem('cart');

    if(localStorageItem) {
      const newCart = JSON.parse(localStorage.getItem('cart'))
          .filter((item) => {
            return !(JSON.stringify(item.product) === JSON.stringify(product) && JSON.stringify(item.addons) === JSON.stringify(addons));
          });

      setCartContent(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  }

  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'pl');
  const [content, setContent] = useState(null);
  const [render, setRender] = useState(true);

  useEffect(() => {
    localStorage.setItem('lang', language);

    // TODO
    // getCustomFields(language)
    //     .then((res) => {
    //       const r = res?.data?.result[0];
    //       if(r) {
    //         console.log(r);
    //         setContent(r);
    //         setRender(true);
    //       }
    //     });
  }, [language]);

  return render ? <CartContext.Provider value={{cartContent, addToCart, removeFromCart, decrementFromCart}}>
    <ContentContext.Provider value={{content, language, setLanguage}}>

      <script id="CookieDeclaration" src="https://consent.cookiebot.com/2078d6f6-502a-4a67-88a4-8578b7204f5b/cd.js" type="text/javascript" async></script>

      <Router>
      {/* GLOBAL */}
      <Route exact path="/">
        <Homepage />
      </Route>
      <Route path="/sklep">
        <Shop />
      </Route>
      <Route path="/moje-konto">
        <LoginAndRegister />
      </Route>
      <Route path="/produkt/*">
        <ProductPage />
      </Route>
      <Route path="/kontakt">
        <ContactPage />
      </Route>
      <Route exact path="/blog">
        <BlogPage />
      </Route>
      <Route path="/post/*">
        <BlogPost />
      </Route>
      <Route path="/przypomnij-haslo">
        <RemindPassword />
      </Route>
      <Route path="/po-rejestracji">
        <AfterRegister />
      </Route>
      <Route path="/odzyskiwanie-hasla">
        <NewPasswordForm />
      </Route>
      <Route path="/zamowienie">
        <ShippingFormPage />
      </Route>
      <Route path="/potwierdzenie-subskrypcji-newslettera">
        <NewsletterVerification />
      </Route>
      <Route path="/faq">
        <Faq />
      </Route>
      <Route path="/o-nas">
        <Page field="page_1" title={language === 'pl' ? 'O nas' : 'About us'} />
      </Route>
      <Route path="/nasze-wartosci">
        <Page field="page_2" title={language === 'pl' ? 'Nasze wartości' : 'Our values'} />
      </Route>
      <Route path="/jak-powstaja">
        <Page field="page_3"
              title={language === 'pl' ? 'Jak powstają' : 'Jak powstają'}
              addon={<Page3Addon />}
        />
      </Route>
      <Route path="/jak-zamawiac">
        <Page field="page_4" title={language === 'pl' ? 'Jak zamawiać' : 'Jak zamawiać'} />
      </Route>
      <Route path="/jak-mierzyc-stope-czolenka">
        <Page field="page_5" title={language === 'pl' ? 'Jak mierzyć stopę - czółenka' : 'Jak mierzyć stopę'} />
      </Route>
      <Route path="/jak-mierzyc-stope-oficerki">
        <Page field="page_11" title={language === 'pl' ? 'Jak mierzyć stopę - oficerki' : 'Jak mierzyć stopę'} />
      </Route>
      <Route path="/jak-pielegnowac">
        <Page field="page_6" title={language === 'pl' ? 'Jak pielęgnować' : 'Jak pielęgnować'} />
      </Route>
      <Route path="/gwarancja">
        <Page field="page_7" title={language === 'pl' ? 'Gwarancja' : 'Gwarancja'} />
      </Route>
      <Route path="/adres-do-korespondencji">
        <Page field="page_10" title={language === 'pl' ? 'Adres do korespondencji' : 'Adres do korespondencji'} />
      </Route>
      <Route path="/regulamin">
        <Page field="terms_of_service"
              width100={true}
              title={language === 'pl' ? 'Regulamin' : 'Terms of Service'} />
      </Route>
      <Route path="/polityka-prywatnosci">
        <Page field="privacy_policy"
              width100={true}
              title={language === 'pl' ? 'Polityka prywatności' : 'Privacy policy'} />
      </Route>

      {/* USER */}
      <Route path="/panel-klienta">
        <ClientPanel />
      </Route>
      <Route path="/informacje-o-zamowieniu">
        <OrderDetails />
      </Route>
      <Route path="/formularz-mierzenia-stopy">
        <FormType1 />
      </Route>
      <Route path="/formularz-weryfikacji-buta">
        <FormType2 />
      </Route>
      <Route path="/oplac-zamowienie">
        <PaymentPage />
      </Route>
      <Route path="/weryfikacja">
        <AccountVerification />
      </Route>

      {/* ADMIN */}
      <Route path="/admin">
        <AdminLogin />
      </Route>
      <Route path="/panel">
        <AdminWrapper page={1} />
      </Route>
      <Route path="/dodaj-produkt">
        <AdminWrapper page={2} />
      </Route>
      <Route path="/lista-produktow">
        <AdminWrapper page={3} />
      </Route>
      <Route path="/dodaj-dodatek">
        <AdminWrapper page={4} />
      </Route>
      <Route path="/lista-dodatkow">
        <AdminWrapper page={5} />
      </Route>
      <Route path="/edytuj-dodatek">
        <AdminWrapper page={6} />
      </Route>
      <Route path="/dodaj-stan-magazynowy-produktow">
        <AdminWrapper page={7} />
      </Route>
      <Route path="/dodaj-stan-magazynowy-dodatkow">
        <AdminWrapper page={8} />
      </Route>
      <Route path="/lista-stanow-magazynowych-produktow">
        <AdminWrapper page={9} />
      </Route>
      <Route path="/lista-stanow-magazynowych-dodatkow">
        <AdminWrapper page={10} />
      </Route>
      <Route path="/dodaj-kategorie">
        <AdminWrapper page={11} />
      </Route>
      <Route path="/lista-kategorii">
        <AdminWrapper page={12} />
      </Route>
      <Route path="/dodaj-artykul">
        <AdminWrapper page={13} />
      </Route>
      <Route path="/lista-artykulow">
        <AdminWrapper page={14} />
      </Route>
      <Route path="/newsletter">
        <AdminWrapper page={15} />
      </Route>
      <Route path="/regulaminy-polski">
        <AdminWrapper page={16} />
      </Route>
      <Route path="/regulaminy-angielski">
        <AdminWrapper page={17} />
      </Route>
      <Route path="/waitlista">
        <AdminWrapper page={18} />
      </Route>
      <Route path="/lista-zamowien">
        <AdminWrapper page={19} />
      </Route>
      <Route path="/szczegoly-waitlisty">
        <AdminWrapper page={20} />
      </Route>
      <Route path="/szczegoly-zamowienia">
        <AdminWrapper page={21} />
      </Route>
      <Route path="/formularz">
        <AdminWrapper page={22} />
      </Route>
      <Route path="/zmien-haslo-administratora">
        <AdminWrapper page={23} />
      </Route>
      <Route path="/formularz-weryfikacji">
        <AdminWrapper page={24} />
      </Route>
    </Router>
    </ContentContext.Provider>
  </CartContext.Provider> : <LoadingPage />
}

export default App;
export { LanguageContext, ContentContext, CartContext }
