import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import authReducer from "./state";
import './index.css'
import { configureStore } from "@reduxjs/toolkit";
import store from './redux/store';
import { Provider } from "react-redux";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);
