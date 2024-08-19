import { Box, Typography, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { StyledBadge } from "./StyledBadge";
import Options from "./Options";

const colorMapping = {
    'dnd': 'red',
    'chat': 'green',
    'xa': 'orange',
    'away': 'yellow',
    'unavailable': 'grey'
};

const Sidebar = ({ setCurrentTab, setModalOpen, setStatusModal }) => {
    const roster = useSelector(state => state.xmpp.roster);
    const status = useSelector(state => state.xmpp.status);
    const images = useSelector(state => state.xmpp.images);

    const handleUserClick = (user) => {
        setCurrentTab(user);
    }

    return (
        <Box
            display="flex"
            flexDirection='column'
            borderRight="1px solid rgba(255, 255, 255, 0.1)"
            justifyContent="space-between"
        >
            <Box height="87%" overflowy="auto">
                {roster.map((user, index) => {
                    //console.log(user)
                    const userStatus = status.find(s => s.from === user.jid) || { status: "unknown" };
                    const userImage = images.find(s => s.from === user.jid);

                    return (
                        <Box
                            key={index}
                            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                            p="2rem 0"
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
                                <StyledBadge overlap='circular' anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} variant='dot' ballcolor={colorMapping[userStatus.status]}>
                                    {userImage ? <Avatar src={`data:image/jpeg;base64,${userImage.image}`} /> : <Avatar>{user.jid.split('@')[0].charAt(0)}</Avatar>}
                                    
                                </StyledBadge>
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                                <Typography fontWeight="500" fontSize="1rem" paddingLeft="0.25rem">{user.jid.split('@')[0]}</Typography>
                                <Typography paddingLeft="0.25rem" fontSize="0.7rem" fontWeight="200">{user.name} {user.jid}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Options setModalOpen={setModalOpen} toggleStatusModal={setStatusModal}/>

        </Box>
    );
};

export default Sidebar;