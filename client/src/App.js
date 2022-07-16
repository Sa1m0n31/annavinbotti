import { BrowserRouter as Router, Route } from 'react-router-dom';
import React, {useEffect, useState} from "react";

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
import {getProductStock} from "./helpers/stocks";
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

const LanguageContext = React.createContext({
  language: localStorage.getItem('lang') || 'pl',
  setLanguage: () => {}
});

const ContentContext = React.createContext(null);
const CartContext = React.createContext(null);

function App() {
  {/* CART */}
  const [cartContent, setCartContent] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);

  const addToCart = (product, addons, amount = false) => {
    if(cartContent?.findIndex((item) => {
      return JSON.stringify(product) === JSON.stringify(item.product) && JSON.stringify(addons) === JSON.stringify(item.addons)
    }) !== -1) {
      /* Change product amount */
      localStorage.setItem('cart', JSON.stringify(cartContent.map((item) => {
        if(JSON.stringify(item.product) === JSON.stringify(product) && JSON.stringify(item.addons) === JSON.stringify(addons)) {
          console.log(product);

          // getProductStock(product.id)
          //     .then((res) => {
          //         const count = res?.data?.result[0]?.counter;
                  const count = 100;
                  if(count >= (amount ? amount : item.amount + 1)) {
                    return {...item, amount: amount ? amount : item.amount + 1}
                  }
                  else {
                    return item;
                  }
              // });
        }
        else {
          return item;
        }
      })));
      setCartContent(cartContent?.map((item) => {
        if(JSON.stringify(item.product) === JSON.stringify(product) && JSON.stringify(item.addons) === JSON.stringify(addons)) {
          // getProductStock(product.id)
          //     .then((res) => {
          //         const count = res?.data?.result[0]?.counter;
            const count = 100;
            if(count >= (amount ? amount : item.amount + 1)) {
              return {...item, amount: amount ? amount : item.amount + 1}
            }
            else {
              return item;
            }
          // });
        }
        else {
          return item;
        }
      }));
    }
    else {
      /* Add new product */
      localStorage.setItem('cart', JSON.stringify([...cartContent, {
        product, addons, amount: 1
      }]));

      setCartContent([...cartContent, {
        product, addons, amount: 1
      }]);
    }
  }

  const removeFromCart = (product, addons) => {
    const localStorageItem = localStorage.getItem('cart');
    if(localStorageItem) {
      const newCart = JSON.parse(localStorage.getItem('cart'))
          .filter((item) => {
            console.log(JSON.stringify(item.product) === JSON.stringify(product));
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

  return render ? <CartContext.Provider value={{cartContent, addToCart, removeFromCart}}>
    <ContentContext.Provider value={{content, language, setLanguage}}><Router>
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

      {/* USER */}
      <Route path="/panel-klienta">
        <ClientPanel />
      </Route>
      <Route path="/zamowienie">
        <ShippingFormPage />
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
    </Router>
    </ContentContext.Provider>
  </CartContext.Provider> : <LoadingPage />
}

export default App;
export { LanguageContext, ContentContext, CartContext }
