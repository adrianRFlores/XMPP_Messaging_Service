export const CONNECT_XMPP = 'CONNECT_XMPP';
export const DISCONNECT_XMPP = 'DISCONNECT_XMPP';
export const XMPP_CONNECTED = 'XMPP_CONNECTED';
export const XMPP_DISCONNECTED = 'XMPP_DISCONNECTED';
export const XMPP_ERROR = 'XMPP_ERROR';
export const XMPP_UNREGISTER = 'XMPP_UNREGISTER';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_ROSTER = 'SET_ROSTER';
export const USER_CHAT_HISTORY = 'USER_CHAT_HISTORY';
export const ADD_MSG = 'ADD_MSG';
export const XMPP_ADD_CONTACT = 'XMPP_ADD_CONTACT';
export const UPDATE_USER_SHOW = 'UPDATE_USER_SHOW';
export const UPDATE_USER_IMAGE = 'UPDATE_USER_IMAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS';
export const SEND_FILE = 'SEND_FILE';

export const connectXmpp = (credentials) => ({
    type: CONNECT_XMPP,
    payload: credentials,
});

export const disconnectXmpp = () => ({
    type: DISCONNECT_XMPP,
});

export const xmppConnected = () => ({
    type: XMPP_CONNECTED,
});

export const xmppDisconnected = () => ({
    type: XMPP_DISCONNECTED,
});

export const xmppUnregister = () => ({
    type: XMPP_UNREGISTER
});

export const xmppError = (error) => ({
    type: XMPP_ERROR,
    payload: error,
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

export const setUserDetails = (userDetails) => ({
    type: SET_USER_DETAILS,
    payload: userDetails,
});

export const setRoster = (roster) => ({
    type: SET_ROSTER,
    payload: roster
});

export const addMsg = (message) => ({
    type: ADD_MSG,
    payload: message
});

export const addContact = (username) => ({
    type: XMPP_ADD_CONTACT,
    payload: username
});

export const updateUserShow = ( jid, show ) => ({
    type: UPDATE_USER_SHOW,
    payload: [jid, show]
});

export const updateUserImage = (jid, image) => ({
    type: UPDATE_USER_IMAGE,
    payload: [jid, image]
});

export const sendMessage = (jid, message, type) => ({
    type: SEND_MESSAGE,
    payload: [jid, message, type]
});

export const updateUserDetails = (status, presence) => ({
    type: UPDATE_USER_DETAILS,
    payload: [status, presence]
});

export const sendFile = (jid, file, type) => ({
    type: SEND_FILE,
    payload: [jid, type],
    meta: { file }
});