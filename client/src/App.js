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

const LanguageContext = React.createContext({
  language: localStorage.getItem('lang') || 'pl',
  setLanguage: () => {}
});

const ContentContext = React.createContext(null);
const StuffContext = React.createContext(null);

function App() {
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

  return render ? <ContentContext.Provider value={{content, language, setLanguage}}><Router>
    <Route exact path="/">
      <Homepage />
    </Route>
    <Route path="/sklep">
      <Shop />
    </Route>
    <Route path="/moje-konto">
      <LoginAndRegister />
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
  </ContentContext.Provider> : <LoadingPage />
}

export default App;
export { LanguageContext, ContentContext }
