// JSDoc made by ChatGPT

// Action Types
export const CONNECT_XMPP = 'CONNECT_XMPP'; // Initiates the XMPP connection with provided credentials.
export const DISCONNECT_XMPP = 'DISCONNECT_XMPP'; // Disconnects the user from the XMPP server.
export const XMPP_CONNECTED = 'XMPP_CONNECTED'; // Indicates a successful connection to the XMPP server.
export const XMPP_DISCONNECTED = 'XMPP_DISCONNECTED'; // Indicates that the connection to the XMPP server was lost or disconnected.
export const XMPP_ERROR = 'XMPP_ERROR'; // Handles errors related to the XMPP connection.
export const XMPP_UNREGISTER = 'XMPP_UNREGISTER'; // Unregisters the user from the XMPP server.
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'; // Indicates a successful login.
export const LOGIN_FAILURE = 'LOGIN_FAILURE'; // Indicates a failed login attempt and stores the error.
export const SET_USER_DETAILS = 'SET_USER_DETAILS'; // Sets the details of the logged-in user.
export const SET_ROSTER = 'SET_ROSTER'; // Sets the user's roster (contact list).
export const USER_CHAT_HISTORY = 'USER_CHAT_HISTORY'; // Fetches the chat history for a specific user.
export const ADD_MSG = 'ADD_MSG'; // Adds a new message to the state.
export const XMPP_ADD_CONTACT = 'XMPP_ADD_CONTACT'; // Adds a new contact to the user's roster.
export const UPDATE_USER_SHOW = 'UPDATE_USER_SHOW'; // Updates a user's presence status (e.g., online, away).
export const UPDATE_USER_IMAGE = 'UPDATE_USER_IMAGE'; // Updates a user's profile image.
export const SEND_MESSAGE = 'SEND_MESSAGE'; // Sends a message to a specific user or group.
export const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS'; // Updates user details such as status and presence.
export const SEND_FILE = 'SEND_FILE'; // Sends a file to a specific user or group.
export const UPDATE_GROUPCHAT = 'UPDATE_GROUPCHAT'; // Updates the details of a group chat.
export const SET_GROUPCHATS = 'SET_GROUPCHATS'; // Sets the list of group chats the user is part of.
export const UPDATE_GROUPCHAT_MEMBERS = 'UPDATE_GROUPCHAT_MEMBERS'; // Updates the list of members in a group chat.
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'; // Adds a new notification to the state.
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'; // Removes a specific notification by its index.
export const REMOVE_MSG_NOTIFICATION = 'REMOVE_MSG_NOTIFICATION'; // Removes message-related notifications for a specific user.
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS'; // Updates a user's status message.
export const CREATE_GROUP = 'CREATE_GROUP'; // Creates a new group chat.

// Action Creators

/**
 * Initiates the XMPP connection with provided credentials.
 * @param {Object} credentials - The credentials for connecting to the XMPP server.
 */
export const connectXmpp = (credentials) => ({
    type: CONNECT_XMPP,
    payload: credentials,
});

/**
 * Disconnects the user from the XMPP server.
 */
export const disconnectXmpp = () => ({
    type: DISCONNECT_XMPP,
});

/**
 * Indicates a successful connection to the XMPP server.
 */
export const xmppConnected = () => ({
    type: XMPP_CONNECTED,
});

/**
 * Indicates that the connection to the XMPP server was lost or disconnected.
 */
export const xmppDisconnected = () => ({
    type: XMPP_DISCONNECTED,
});

/**
 * Unregisters the user from the XMPP server.
 */
export const xmppUnregister = () => ({
    type: XMPP_UNREGISTER,
});

/**
 * Handles errors related to the XMPP connection.
 * @param {Object} error - The error object containing error details.
 */
export const xmppError = (error) => ({
    type: XMPP_ERROR,
    payload: error,
});

/**
 * Indicates a successful login.
 */
export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

/**
 * Indicates a failed login attempt and stores the error.
 * @param {Object} error - The error object containing error details.
 */
export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error,
});

/**
 * Sets the details of the logged-in user.
 * @param {Object} userDetails - The details of the logged-in user.
 */
export const setUserDetails = (userDetails) => ({
    type: SET_USER_DETAILS,
    payload: userDetails,
});

/**
 * Sets the user's roster (contact list).
 * @param {Array} roster - The list of contacts.
 */
export const setRoster = (roster) => ({
    type: SET_ROSTER,
    payload: roster
});

/**
 * Adds a new message to the state.
 * @param {Object} message - The message object containing message details.
 */
export const addMsg = (message) => ({
    type: ADD_MSG,
    payload: message
});

/**
 * Adds a new contact to the user's roster.
 * @param {String} username - The username of the contact to be added.
 * @param {String} type - The type of contact (e.g., friend, family).
 */
export const addContact = (username, type) => ({
    type: XMPP_ADD_CONTACT,
    payload: [username, type]
});

/**
 * Updates a user's presence status (e.g., online, away).
 * @param {String} jid - The JID (Jabber ID) of the user.
 * @param {String} show - The presence status to be updated.
 */
export const updateUserShow = ( jid, show ) => ({
    type: UPDATE_USER_SHOW,
    payload: [jid, show]
});

/**
 * Updates a user's status message.
 * @param {String} jid - The JID (Jabber ID) of the user.
 * @param {String} status - The status message to be updated.
 */
export const updateUserStatus = ( jid, status ) => ({
    type: UPDATE_USER_STATUS,
    payload: [jid, status]
});

/**
 * Updates a user's profile image.
 * @param {String} jid - The JID (Jabber ID) of the user.
 * @param {String} image - The URL or base64 string of the image.
 */
export const updateUserImage = (jid, image) => ({
    type: UPDATE_USER_IMAGE,
    payload: [jid, image]
});

/**
 * Sends a message to a specific user or group.
 * @param {String} jid - The JID (Jabber ID) of the recipient.
 * @param {String} message - The message content.
 * @param {String} type - The type of message (e.g., chat, groupchat).
 */
export const sendMessage = (jid, message, type) => ({
    type: SEND_MESSAGE,
    payload: [jid, message, type]
});

/**
 * Updates user details such as status and presence.
 * @param {String} status - The user's status.
 * @param {String} presence - The user's presence (e.g., online, offline).
 */
export const updateUserDetails = (status, presence) => ({
    type: UPDATE_USER_DETAILS,
    payload: [status, presence]
});

/**
 * Sends a file to a specific user or group.
 * @param {String} jid - The JID (Jabber ID) of the recipient.
 * @param {File} file - The file to be sent.
 * @param {String} type - The type of message (e.g., chat, groupchat).
 */
export const sendFile = (jid, file, type) => ({
    type: SEND_FILE,
    payload: [jid, type],
    meta: { file }
});

/**
 * Updates the details of a group chat.
 * @param {Object} groupchat - The group chat object containing updated details.
 */
export const updateGroupchat = (groupchat) => ({
    type: UPDATE_GROUPCHAT,
    payload: groupchat,
});

/**
 * Updates the list of members in a group chat.
 * @param {Object} groupchat - The group chat object containing updated member details.
 */
export const updateGroupchatMembers = (groupchat) => ({
    type: UPDATE_GROUPCHAT_MEMBERS,
    payload: groupchat,
});

/**
 * Sets the list of group chats the user is part of.
 * @param {Array} groupchats - The list of group chats.
 */
export const setGroupchats = (groupchats) => ({
    type: SET_GROUPCHATS,
    payload: groupchats,
});

/**
 * Adds a new notification to the state.
 * @param {Object} notification - The notification object containing notification details.
 */
export const addNotification = (notification) => ({
    type: ADD_NOTIFICATION,
    payload: notification
});

/**
 * Removes a specific notification by its index.
 * @param {Number} index - The index of the notification to be removed.
 */
export const removeNotification = (index) => ({
    type: REMOVE_NOTIFICATION,
    payload: [index]
});

/**
 * Removes message-related notifications for a specific user.
 * @param {String} user - The user whose message notifications should be removed.
 */
export const removeMsgNotifications = (user) => ({
    type: REMOVE_MSG_NOTIFICATION,
    payload: user
});

/**
 * Creates a new group chat.
 * @param {Object} group - The group object containing group details.
 */
export const createGroup = (group) => ({
    type: CREATE_GROUP,
    payload: group
});
