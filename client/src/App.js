import { BrowserRouter as Router, Route } from 'react-router-dom';

import './static/style/style.css'
import './static/style/admin.css'
import './static/style/mobile.css'

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
  </Router>
}

export default App;
