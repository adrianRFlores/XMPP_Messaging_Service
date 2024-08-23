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
export const UPDATE_GROUPCHAT = 'UPDATE_GROUPCHAT';
export const SET_GROUPCHATS = 'SET_GROUPCHATS';
export const UPDATE_GROUPCHAT_MEMBERS = 'UPDATE_GROUPCHAT_MEMBERS';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const REMOVE_MSG_NOTIFICATION = 'REMOVE_MSG_NOTIFICATION';
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';

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
    type: XMPP_UNREGISTER,
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

export const addContact = (username, type) => ({
    type: XMPP_ADD_CONTACT,
    payload: [username, type]
});

export const updateUserShow = ( jid, show ) => ({
    type: UPDATE_USER_SHOW,
    payload: [jid, show]
});

export const updateUserStatus = ( jid, status ) => ({
    type: UPDATE_USER_STATUS,
    payload: [jid, status]
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

export const updateGroupchat = (groupchat) => ({
    type: UPDATE_GROUPCHAT,
    payload: groupchat,
});

export const updateGroupchatMembers = (groupchat) => ({
    type: UPDATE_GROUPCHAT_MEMBERS,
    payload: groupchat,
});

export const setGroupchats = (groupchats) => ({
    type: SET_GROUPCHATS,
    payload: groupchats,
});

export const addNotification = (notification) => ({
    type: ADD_NOTIFICATION,
    payload: notification
});

export const removeNotification = (index) => ({
    type: REMOVE_NOTIFICATION,
    payload: [index]
});

export const removeMsgNotifications = (user) => ({
    type: REMOVE_MSG_NOTIFICATION,
    payload: user
});