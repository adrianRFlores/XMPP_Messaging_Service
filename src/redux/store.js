// JSDoc made by ChatGPT

import { configureStore } from '@reduxjs/toolkit'; // Function to configure the Redux store
import xmppReducer from './reducer'; // Reducer to handle XMPP-related state
import xmppMiddleware from './middleware'; // Custom middleware for handling XMPP actions

// Configuring the Redux store
const store = configureStore({
    // Defining the reducer for the store, with the `xmpp` key mapping to `xmppReducer`
    reducer: {
        xmpp: xmppReducer,
    },
    // Customizing the middleware
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // Customizing the serializable check to ignore specific actions
        serializableCheck: {
            // Ignoring the 'SEND_FILE' action in the serializable check
            ignoreActions: ['SEND_FILE']
        }
    }).concat(xmppMiddleware),
});

// Exporting the configured store as the default export
export default store;
