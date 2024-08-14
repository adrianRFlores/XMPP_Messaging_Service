export const CONNECT_XMPP = 'CONNECT_XMPP';
export const DISCONNECT_XMPP = 'DISCONNECT_XMPP';
export const XMPP_CONNECTED = 'XMPP_CONNECTED';
export const XMPP_DISCONNECTED = 'XMPP_DISCONNECTED';
export const XMPP_ERROR = 'XMPP_ERROR';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const REGISTER_XMPP = 'XMPP_REGISTER'

export const connectXmpp = (credentials) => ({
    type: CONNECT_XMPP,
    payload: credentials,
});

/*export const registerXmpp = (credentials) = ({
    type: REGISTER_XMPP,
    payload: credentials,
})*/

export const disconnectXmpp = () => ({
    type: DISCONNECT_XMPP,
});

export const xmppConnected = () => ({
    type: XMPP_CONNECTED,
});

export const xmppDisconnected = () => ({
    type: XMPP_DISCONNECTED,
});

export const xmppError = (error) => ({
    type: XMPP_ERROR,
    payload: error,
});

export const sendMessage = (message) => ({
    type: SEND_MESSAGE,
    payload: message,
});

export const receiveMessage = (message) => ({
    type: RECEIVE_MESSAGE,
    payload: message,
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});
