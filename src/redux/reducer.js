// JSDoc made by ChatGPT

// Importing action types from the actions module
import {
    XMPP_CONNECTED,
    XMPP_DISCONNECTED,
    XMPP_ERROR,
    LOGIN_SUCCESS,
    SET_USER_DETAILS,
    SET_ROSTER,
    ADD_MSG,
    XMPP_UNREGISTER,
    XMPP_ADD_CONTACT,
    UPDATE_USER_SHOW,
    UPDATE_USER_IMAGE,
    UPDATE_USER_DETAILS,
    SEND_FILE,
    UPDATE_GROUPCHAT,
    UPDATE_GROUPCHAT_MEMBERS,
    SET_GROUPCHATS,
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    REMOVE_MSG_NOTIFICATION,
    UPDATE_USER_STATUS,
    DISCONNECT_XMPP
} from './actions';

// Initial state of the XMPP reducer
const initialState = {
    connected: false, // Indicates whether the XMPP connection is active
    authenticated: false, // Indicates whether the user is authenticated
    error: null, // Holds any error messages
    userDetails: { // Stores details of the current user
        username: "",
        profilePic: "",
        status: "",
        presenceMsg: ""
    },
    roster: [], // Holds the list of contacts
    status: [], // Stores status updates for contacts
    messages: [], // Stores chat messages
    images: [], // Stores profile images of users
    groupchats: [], // Holds the list of group chats
    notifications: [] // Stores notification messages
};

// The main reducer function that handles state changes based on action types
const xmppReducer = (state = initialState, action) => {
    switch (action.type) {
        // When XMPP connects successfully, update the state
        case XMPP_CONNECTED:
            return { ...state, connected: true, authenticated: true, error: null };
        
        // When XMPP disconnects, reset the state to the initial state
        case DISCONNECT_XMPP:
            return initialState;

        // When the user unregisters, reset the state to the initial state
        case XMPP_UNREGISTER:
            return initialState;

        // When an XMPP error occurs, store the error message in the state
        case XMPP_ERROR:
            return { ...state, error: action.payload };

        // When login is successful, update the state to reflect the connection and authentication
        case LOGIN_SUCCESS:
            return { ...state, connected: true, authenticated: true, error: null };

        // Update user details (e.g., username, profilePic)
        case SET_USER_DETAILS:
            return { ...state, userDetails: action.payload };

        // Update the roster with the payload containing the list of contacts
        case SET_ROSTER:
            return { ...state, roster: action.payload };

        // Add a new message to the messages array or update the order if it already exists
        case ADD_MSG: {
            const exists = state.messages.some(msg => msg.timestamp === action.payload.timestamp);
            if (exists) {
                return { ...state, messages: [...state.messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) };
            }
            return {
                ...state,
                messages: [...state.messages, action.payload].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            };
        }

        // Handle the addition of a new contact (not fully implemented here)
        case XMPP_ADD_CONTACT:
            return state;

        // Update a user's status (e.g., online, offline)
        case UPDATE_USER_SHOW:
            let [jid, newStatus] = action.payload;
            let existingUser = state.status.find(user => user.from === jid);
            let updatedStatus = existingUser
                ? state.status.map(user =>
                    user.from === jid
                        ? { ...user, status: newStatus }
                        : user
                    )
                : [...state.status, { from: jid, status: newStatus }];
            return { ...state, status: updatedStatus };

        // Update a user's status message (e.g., "Away", "Busy")
        case UPDATE_USER_STATUS:
            let [jidMsg, newMsg] = action.payload;
            let existingUserStatus = state.status.find(user => user.from === jidMsg);
            let updatedStatusMsg = existingUserStatus
                ? state.status.map(user =>
                    user.from === jidMsg ? { ...user, statusMsg: newMsg } : user
                    )
                : [...state.status, { from: jidMsg, status: newMsg }];
            return { ...state, status: updatedStatusMsg };

        // Update a user's profile image
        case UPDATE_USER_IMAGE:
            let [jidImg, newImg] = action.payload;

            // If the image belongs to the current user, update their profile picture
            if (jidImg.split('@')[0] === state.userDetails.username) {
                return { ...state, userDetails: {...state.userDetails, profilePic: newImg} }
            }
            
            let existingUserImg = state.images.find(user => user.from === jidImg);
            let updatedImage = existingUserImg
                ? state.images.map(user =>
                    user.from === jidImg
                        ? { ...user, image: newImg }
                        : user
                    )
                : [...state.images, { from: jidImg, image: newImg }];
            return { ...state, images: updatedImage };

        // Update the user's status and presence message
        case UPDATE_USER_DETAILS:
            return { ...state, userDetails: { ...state.userDetails, status: action.payload[0], presenceMsg: action.payload[1]} };

        // Update the group chat name based on the provided JID
        case UPDATE_GROUPCHAT:
            let updatedGroupchats = state.groupchats.map(gc => 
                gc.jid === action.payload.jid ? 
                { ...gc, name: action.payload.name } : gc
            )
            return { ...state, groupchats: updatedGroupchats };

        // Update the members of a group chat based on the provided JID
        case UPDATE_GROUPCHAT_MEMBERS:
            let updatedMembers = state.groupchats.map(gc => 
                gc.jid === action.payload.jid ? 
                { ...gc, members: action.payload.members } : gc
            )
            return { ...state, groupchats: updatedMembers };

        // Set the group chats with the payload containing the list of group chats
        case SET_GROUPCHATS:
            return { ...state, groupchats: action.payload };

        // Add a new notification to the notifications array
        case ADD_NOTIFICATION:
            return { ...state, notifications: [ ...state.notifications, action.payload ] };

        // Remove a notification from the notifications array based on the index provided
        case REMOVE_NOTIFICATION:
            return { ...state, notifications: state.notifications.filter((item, index) => index !== action.payload[0]) };

        // Remove message notifications for a specific user
        case REMOVE_MSG_NOTIFICATION:
            return { ...state, notifications: state.notifications.filter((item) => item.from.split('/')[0] !== action.payload) };

        // Default case returns the current state if no matching action type is found
        default:
            return state;
    }
};

export default xmppReducer;
