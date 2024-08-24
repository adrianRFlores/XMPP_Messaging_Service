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
    status: [],
    messages: [],
    images: [],
    groupchats: [],
    notifications: []
};

const xmppReducer = (state = initialState, action) => {
    switch (action.type) {
        case XMPP_CONNECTED:
            return { ...state, connected: true, authenticated: true, error: null };
        case DISCONNECT_XMPP:
            return initialState;
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
            
        case XMPP_ADD_CONTACT:
            return state;
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

        case UPDATE_USER_STATUS:
            let [jidMsg, newMsg] = action.payload;
            
            let existingUserStatus = state.status.find(user => user.from === jidMsg);
        
            let updatedStatusMsg = existingUserStatus
                ? state.status.map(user =>
                    user.from === jidMsg ? { ...user, statusMsg: newMsg } : user
                    )
                : [...state.status, { from: jidMsg, status: newStatus }];
        
            return { ...state, status: updatedStatusMsg };
            
        case UPDATE_USER_IMAGE:
            let [jidImg, newImg] = action.payload;

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

        case UPDATE_USER_DETAILS:
            return { ...state, userDetails: { ...state.userDetails, status: action.payload[0], presenceMsg: action.payload[1]} };

        case UPDATE_GROUPCHAT:
            let updatedGroupchats = state.groupchats.map(gc => 
                gc.jid === action.payload.jid ? 
                { ...gc, name: action.payload.name } : gc
            )
            console.log(updatedGroupchats)
            return { ...state, groupchats: updatedGroupchats};

        case UPDATE_GROUPCHAT_MEMBERS:
            let updatedMembers = state.groupchats.map(gc => 
                gc.jid === action.payload.jid ? 
                { ...gc, members: action.payload.members } : gc
            )
            console.log(updatedMembers)
            return { ...state, groupchats: updatedMembers};

        case SET_GROUPCHATS:
            return { ...state, groupchats: action.payload };

        case ADD_NOTIFICATION:
            return { ...state, notifications: [ ...state.notifications, action.payload ] }
        
        case REMOVE_NOTIFICATION:
            return { ...state, notifications: state.notifications.filter((item, index) => index !== action.payload[0]) };

        case REMOVE_MSG_NOTIFICATION:
            return { ...state, notifications: state.notifications.filter((item) => item.from.split('/')[0] !== action.payload) };

        default:
            return state;
    }
};

export default xmppReducer;
