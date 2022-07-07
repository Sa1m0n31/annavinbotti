import React from 'react';
import ReactDOM from "react-dom";
import App from './App';
import axios from "axios";
import settings from "./static/settings";

axios.defaults.baseURL = settings.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// TODO: sprawdzic proces dodawania opcji dodatkow - problem z ta sama nazwa opcji dodatku

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
