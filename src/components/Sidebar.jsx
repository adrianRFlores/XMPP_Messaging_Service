import { Box, Typography, useTheme, useMediaQuery, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { StyledBadge } from "./StyledBadge";
import Options from "./Options";
import { People, Person } from "@mui/icons-material";

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
            <Box height="87%" sx={{overflowY:"hidden"}} display='flex' justifyContent="space-between" flexDirection="column">
                <Box display="flex" sx={{overflowY:"auto"}} flexDirection="column" width="100%">
                    {roster.map((user, index) => {
                        //console.log(user)
                        const userStatus = status.find(s => s.from === user.jid) || { status: "unknown" };
                        const userImage = images.find(s => s.from === user.jid);

                        return (
                            <Box
                                key={index}
                                borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                                p="0.7rem 0"
                                height="fit-content"
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
                <Box display="grid" gridTemplateColumns="1fr 1fr" borderTop="1px solid rgba(255, 255, 255, 0.1)">
                    <Box borderRight="1px solid rgba(255, 255, 255, 0.1)" p="0.5rem 0 0.3rem 0"
                        sx={{
                            '&:hover': {
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                transition: "0.3s",
                                cursor: 'pointer'
                            },
                            transition: "0.3s"
                        }}
                    >
                        <Person />
                    </Box>
                    <Box p="0.5rem 0 0.3rem 0"
                        sx={{
                            '&:hover': {
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                transition: "0.3s",
                                cursor: 'pointer'
                            },
                            transition: "0.3s"
                        }}
                    >
                        <People />
                    </Box>
                </Box>
            </Box>
            <Options setModalOpen={setModalOpen} toggleStatusModal={setStatusModal}/>

        </Box>
    );
};

export default Sidebar;