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
    SET_GROUPCHATS
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
    groupchats: []
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
            return { ...state, messages: [...state.messages, action.payload] };
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

        default:
            return state;
    }
};

export default xmppReducer;
