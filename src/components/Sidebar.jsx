import { Box, Typography, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { StyledBadge } from "./StyledBadge";
import Options from "./Options";

const Sidebar = ({ setCurrentTab, setModalOpen }) => {
    const roster = useSelector(state => state.xmpp.roster);

    const handleUserClick = (user) => {
        setCurrentTab(user);
    }

    console.log(roster)

    return (
        <Box
            display="flex"
            flexDirection='column'
            borderRight="1px solid rgba(255, 255, 255, 0.1)"
            justifyContent="space-between"
        >
            <Box height="87%" overflowY="auto">
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
                            <Typography fontWeight="500" fontSize="1rem" paddingLeft="0.25rem">{user.jid.split('@')[0]} {index}</Typography>
                        </Box>
                    );
                })}
            </Box>
            <Options setModalOpen={setModalOpen}/>

        </Box>
    );
};

export default Sidebar;