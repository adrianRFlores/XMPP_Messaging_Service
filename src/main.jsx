// Documentation and comments made by ChatGPT

import React from 'react'; // Core React library for building UI components
import ReactDOM from 'react-dom/client'; // ReactDOM for rendering React components in the DOM
import App from './App.jsx'; // The main App component that contains the application logic
import './index.css'; // Importing global CSS styles for the application
import store from './redux/store'; // Importing the Redux store configured in 'store.js'
import { Provider } from "react-redux"; // Provider component to make the Redux store available to the entire app

// Disabling SSL certificate validation (for development purposes only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Creating a root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the application inside the root element
// The <React.StrictMode> wrapper helps to detect potential problems in an application by running certain checks and warnings in development mode
root.render(
  <React.StrictMode>
    {/* The Provider component makes the Redux store available to the entire app */}
    <Provider store={store}>
        {/* Rendering the main App component */}
        <App />
    </Provider>
  </React.StrictMode>
);
