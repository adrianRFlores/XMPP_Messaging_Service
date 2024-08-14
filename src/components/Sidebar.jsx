import { Box, Typography, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { StyledBadge } from "./StyledBadge";
import { userChatHistory } from '../redux/actions';
import Options from "./Options";

const Sidebar = () => {
    const roster = useSelector(state => state.xmpp.roster);
    const dispatch = useDispatch();

    const handleUserClick = (user) => {
        dispatch(userChatHistory(user));
    }

    return (
        <Box
            display="grid"
            gridTemplateRows="6fr 1fr"
            borderRight="1px solid rgba(255, 255, 255, 0.1)"
        >
            {roster.map((user) => {
                return (
                    <Box 
                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                        height="10%"
                        display='flex'
                        flexDirection="row"
                        alignItems="center"
                        onClick={() => {handleUserClick(user.jid)}}
                    >
                        <Box width="fit-content" p="0.5rem">
                            <StyledBadge overlap='circular' anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} variant='dot'>
                                <Avatar>{user.jid.split('@')[0].charAt(0)}</Avatar>
                            </StyledBadge>
                        </Box>
                        <Typography fontWeight="500" fontSize="1rem" paddingLeft="0.25rem">{user.jid.split('@')[0]}</Typography>
                    </Box>
                )
            })}
            <Options />

        </Box>
    );
};

export default Sidebar;