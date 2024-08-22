import { Box, Typography, useTheme, IconButton, Icon, Avatar} from "@mui/material";
import { PersonAddAlt1Rounded, LogoutRounded, DeleteTwoTone } from "@mui/icons-material";
import { StyledBadge } from './StyledBadge';
import { useSelector, useDispatch } from 'react-redux';
import { disconnectXmpp, xmppUnregister } from "../redux/actions";
import { useNavigate } from "react-router-dom";

const colorMapping = {
    'dnd': 'red',
    'chat': 'green',
    'xa': 'orange',
    'away': 'yellow',
    'unavailable': 'grey'
};

const Options = ({ setModalOpen, toggleStatusModal }) => {

    const userDetails = useSelector(state => state.xmpp.userDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const unregister = () => {
        dispatch(xmppUnregister());
        navigate('/');
    }

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
                    <StyledBadge overlap='circular' anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} variant='dot' ballcolor={colorMapping[userDetails.status]}>
                        <Avatar sx={{ width: "match-parent", height: "match-parent"}} src={`data:image/jpeg;base64,${userDetails.profilePic}`}></Avatar>
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