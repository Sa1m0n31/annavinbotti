import { BrowserRouter as Router, Route } from 'react-router-dom';

import './static/style/style.css'
import './static/style/admin.css'
import './static/style/mobile.css'
import './static/style/mobile-admin.css'

import 'react-upload-gallery/dist/style.css'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminWrapper from "./components/admin/AdminWrapper";

function App() {
  return <Router>
    <Route exact path="/">
      <div>
        ...
      </div>
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
  </Router>
}

export default App;
