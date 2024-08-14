import {
    XMPP_CONNECTED,
    XMPP_DISCONNECTED,
    XMPP_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    RECEIVE_MESSAGE,
} from './actions';

const initialState = {
    connected: false,
    authenticated: false,
    error: null,
    messages: [],
};

const xmppReducer = (state = initialState, action) => {
    switch (action.type) {
        case XMPP_CONNECTED:
            return { ...state, connected: true, authenticated: true, error: null };
        case XMPP_DISCONNECTED:
            return { ...state, connected: false, authenticated: false };
        case XMPP_ERROR:
            return { ...state, error: action.payload };
        case LOGIN_SUCCESS:
            return { ...state, connected: true, authenticated: true, error: null };
        case LOGIN_FAILURE:
            return { ...state, authenticated: false, error: action.payload };
        case RECEIVE_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload] };
        default:
            return state;
    }
};

export default xmppReducer;
