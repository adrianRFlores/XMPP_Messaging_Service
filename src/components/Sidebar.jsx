import { Box, Typography, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { StyledBadge } from "./StyledBadge";
import Options from "./Options";

const Sidebar = ({ setCurrentTab }) => {
    const roster = useSelector(state => state.xmpp.roster);

    const handleUserClick = (user) => {
        setCurrentTab(user);
    }

    return (
        <Box
            display="grid"
            gridTemplateRows="6fr 1fr"
            borderRight="1px solid rgba(255, 255, 255, 0.1)"
        >
            {roster.map((user, index) => {
                return (
                    <Box
                        key={index}
                        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                        height="10%"
                        display='flex'
                        flexDirection="row"
                        alignItems="center"
                        onClick={() => {handleUserClick(user.jid)}}
                        sx={{
                            '&:hover': {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                transition: "0.3s",
                                cursor: 'pointer'
                            },
                            borderRadius: index === 0 ? '10px 0 0 0' : '0px',
                            transition: "0.3s"
                        }}
                    >
                        <Box width="fit-content" p="0.5rem">
                            <StyledBadge overlap='circular' anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} variant='dot'>
                                <Avatar>{user.jid.split('@')[0].charAt(0)}</Avatar>
                            </StyledBadge>
                        </Box>
                        <Typography fontWeight="500" fontSize="1rem" paddingLeft="0.25rem">{user.jid.split('@')[0]}</Typography>
                    </Box>
                );
            })}
            <Options />

        </Box>
    );
};

export default Sidebar;