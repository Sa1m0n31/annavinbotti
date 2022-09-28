import React from 'react';
import ReactDOM from "react-dom";
import App from './App';
import axios from "axios";
import settings from "./static/settings";
import ReactPixel from 'react-facebook-pixel';

axios.defaults.baseURL = settings.API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

const options = {
    autoConfig: true,
    debug: false
};

ReactPixel.init('527468025090690', options);
ReactPixel.pageView();

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
