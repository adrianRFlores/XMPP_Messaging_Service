// JSDoc made by ChatGPT

import { Box, Typography, IconButton, Avatar } from "@mui/material";
import { PersonAddAlt1Rounded, LogoutRounded, DeleteTwoTone } from "@mui/icons-material";
import { StyledBadge } from './StyledBadge';
import { useSelector, useDispatch } from 'react-redux';
import { disconnectXmpp, xmppUnregister } from "../redux/actions";
import { useNavigate } from "react-router-dom";

// Mapping of status values to corresponding colors
const colorMapping = {
    'dnd': 'red',
    'chat': 'green',
    'xa': 'orange',
    'away': 'yellow',
    'unavailable': 'grey'
};

/**
 * Options component
 * 
 * A component that provides various options for user interaction, including displaying
 * user details, setting status, adding contacts, logging out, and unregistering the user.
 * 
 * @component
 * @param {Object} props - The props that are passed to the component.
 * @param {Function} props.setModalOpen - Function to control the visibility of the add contact modal.
 * @param {Function} props.toggleStatusModal - Function to toggle the visibility of the status modal.
 * @returns {JSX.Element} The Options component.
 */
const Options = ({ setModalOpen, toggleStatusModal }) => {
    const userDetails = useSelector(state => state.xmpp.userDetails); // User details from Redux store
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Unregisters the user and navigates to the home page
     * 
     * @function unregister
     */
    const unregister = () => {
        dispatch(xmppUnregister());
        navigate('/');
    }

    /**
     * Disconnects the user from XMPP
     * 
     * @function disconnect
     */
    const disconnect = () => {
        dispatch(disconnectXmpp());
    }

    return (
        <Box borderTop="1px solid rgba(255, 255, 255, 0.1)" display="flex" flexDirection="row" justifyContent="space-between" height="13%">
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    cursor: "pointer",
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)'
                    }
                }}
                height="fit-content"
                alignSelf="center"
                paddingRight="0.75rem"
                borderRadius="10px"
                onClick={toggleStatusModal}
            >
                <Box padding="0.5rem">
                    <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} variant='dot' ballcolor={colorMapping[userDetails.status]}>
                        <Avatar sx={{ width: "match-parent", height: "match-parent" }} src={`data:image/jpeg;base64,${userDetails.profilePic}`} />
                    </StyledBadge>
                </Box>
                
                <Box display="flex" flexDirection="column" paddingLeft="0.25rem">
                    <Typography fontWeight="500" fontSize="1rem">{userDetails.username}</Typography>
                    <Typography>{userDetails.presenceMsg}</Typography>
                </Box>
            </Box>

            <Box display="flex" justifyContent="space-evenly" alignItems="center">
                <IconButton onClick={setModalOpen}>
                    <PersonAddAlt1Rounded />
                </IconButton>
                <IconButton onClick={disconnect}>
                    <LogoutRounded />
                </IconButton>
                <IconButton onClick={unregister}>
                    <DeleteTwoTone />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Options;
