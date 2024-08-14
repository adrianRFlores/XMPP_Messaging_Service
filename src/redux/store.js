import { configureStore } from '@reduxjs/toolkit';
import xmppReducer from './reducer';
import xmppMiddleware from './middleware';

const store = configureStore({
    reducer: {
        xmpp: xmppReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(xmppMiddleware),
});

export default store;
