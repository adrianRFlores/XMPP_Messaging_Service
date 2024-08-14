export const CONNECT_XMPP = 'CONNECT_XMPP';
export const DISCONNECT_XMPP = 'DISCONNECT_XMPP';
export const XMPP_CONNECTED = 'XMPP_CONNECTED';
export const XMPP_DISCONNECTED = 'XMPP_DISCONNECTED';
export const XMPP_ERROR = 'XMPP_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const SET_ROSTER = 'SET_ROSTER';

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
})
