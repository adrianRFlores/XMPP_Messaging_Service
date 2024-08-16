import {
    XMPP_CONNECTED,
    XMPP_DISCONNECTED,
    XMPP_ERROR,
    LOGIN_SUCCESS,
    SET_USER_DETAILS,
    SET_ROSTER,
    ADD_MSG,
    XMPP_UNREGISTER,
    XMPP_ADD_CONTACT
} from './actions';

const initialState = {
    connected: false,
    authenticated: false,
    error: null,
    userDetails: {
        username: "",
        profilePic: "",
        status: "",
        presenceMsg: ""
    },
    roster: [],
    messages: []
};

const xmppReducer = (state = initialState, action) => {
    switch (action.type) {
        case XMPP_CONNECTED:
            return { ...state, connected: true, authenticated: true, error: null };
        case XMPP_DISCONNECTED:
            return { ...state, connected: false, authenticated: false };
        case XMPP_UNREGISTER:
            return initialState;
        case XMPP_ERROR:
            return { ...state, error: action.payload };
        case LOGIN_SUCCESS:
            return { ...state, connected: true, authenticated: true, error: null };
        case SET_USER_DETAILS:
            return { ...state, userDetails: action.payload };
        case SET_ROSTER:
            return { ...state, roster: action.payload};
        case ADD_MSG:
            console.log(state.messages);
            console.log([...state.messages, action.payload])
            return { ...state, messages: [...state.messages, action.payload] };
        case XMPP_ADD_CONTACT:
            return state; //{ ...state, roster: [...state.roster, `${action.payload}@alumchat.lol`] };
        default:
            return state;
    }
};

export default xmppReducer;
