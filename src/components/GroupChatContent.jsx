import { Box, Typography, useTheme, IconButton, Icon, Avatar, TextField} from "@mui/material";
import { AttachFileRounded, SendRounded } from "@mui/icons-material";
import { StyledBadge } from './StyledBadge';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { sendMessage, sendFile } from "../redux/actions";

const GroupChatContent = ({ messages, currentUser, selectedGroup, name, members }) => {
    const dispatch = useDispatch();
    const images = useSelector(state => state.xmpp.images);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    let membersString = members?.map(member => member.split('@')[0]).join(', ');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const drawDateTest = (lastDate, currentDate) => {
        const time1 = new Date(lastDate);
        const time2 = new Date(currentDate);

        return (
            time1.getFullYear() !== time2.getFullYear() ||
            time1.getMonth() !== time2.getMonth() ||
            time1.getDate() !== time2.getDate()
        );
    }

    const formatStamp = (stamp) => {
        const date = new Date(stamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}`;

        return { formattedDate, formattedTime };
    }

    const handleSend = () => {
        if (inputMessage) {
            console.log(selectedGroup)
            //dispatch(sendMessage(selectedUser, inputMessage, 'chat'));
            setInputMessage('')
        }
        if (selectedFile) {

            //dispatch(sendFile(selectedGroup, selectedFile));
            console.log('File to upload:', selectedFile);
            setSelectedFile(null);
        }
    }

    return (
        <Box display="flex" flexDirection="column" sx={{overflowY: "hidden"}}>
            <Box height="86.94%" display="flex" flexDirection="column">
                <Box height="12.6%" borderBottom="1px solid rgba(255, 255, 255, 0.1)" padding="0.5rem 0" display="flex" alignItems="center" gap="1rem" p="0 1rem">
                    <Avatar sx={{ width: "match-parent", height: "match-parent"}}>{selectedGroup.split('@')[0][0]}</Avatar>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Typography fontWeight="500" fontSize="1.2rem">{name}</Typography>
                        <Typography fontWeight="300" fontSize="0.8rem">{membersString?.length > 60 ? membersString.slice(0, 60) + '...' : membersString}</Typography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{ overflowY: "auto" }}
                    p="0 0 0.7rem 0"
                    height="87.4%"
                >
                    {messages.map((message, index) => {
                        let isUser = message.from.split('@')[0] === currentUser;
                        let shouldDrawDate = false;
                        let { formattedDate, formattedTime } = formatStamp(message.timestamp);
                        let userImage = isUser ? images.find(s => s.from === `${currentUser}@alumchat.lol`) : images.find(s => s.from === message.ofrom)

                        if (index > 0) {
                            shouldDrawDate = drawDateTest(message.timestamp, messages[index - 1].timestamp);
                        } else {
                            shouldDrawDate = true;
                        }
                        
                        return (
                            <>
                                {shouldDrawDate && 
                                    <Typography
                                        marginTop="0.35rem"
                                        key={index+20}
                                        display="flex"
                                        alignItems="center"
                                        textAlign="center"
                                        color="rgba(255, 255, 255, 0.4)"
                                        fontWeight="200"
                                        sx={{
                                            '&::before, &::after': {
                                                content: '""',
                                                flex: "1",
                                                borderBottom: "0.5px solid rgba(255, 255, 255, 0.1)",
                                                margin: "0 10px"
                                            }
                                        }}
                                    >
                                        {formattedDate}
                                    </Typography>
                                }
                                <Box display="flex"
                                    justifyContent={isUser ? "flex-end" : "flex-start"}
                                    flexDirection={isUser ? "row-reverse" : "row"}
                                >
                                    <Avatar src={userImage}>{message.ofrom.split('@')[0][0]}</Avatar>
                                    <Box
                                        key={index}
                                        maxWidth="70%"
                                        width="fit-content"
                                        backgroundColor={isUser ? "rgba(255, 255, 255)" : ""}
                                        border={isUser ? "0" : "1px solid rgba(255, 255, 255, 0.1)"}
                                        borderRadius={isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"}
                                        color={isUser ? "black" : "white"}
                                        padding="10px 15px"
                                        margin={isUser ? "0.35rem 1rem 0 0" : "0.35rem 0 0 1rem"}
                                        sx={{wordBreak: "break-word",
                                            overflowWrap: "break-word"
                                        }}
                                    >
                                        <Typography fontWeight="500" textAlign={isUser ? "right" : "left"}>{message.ofrom.split('@')[0]}</Typography>
                                        {message.image !== '' ? 
                                            <Box
                                                component="img"
                                                src={message.image}
                                                alt={message.content}
                                                maxWidth="100%" 
                                                maxHeight="100%"
                                                borderRadius="15px"
                                                sx={{objectFit:"contain"}}
                                            />
                                        : 
                                            <Box flexGrow="1" textAlign="justify">
                                                {message.content}
                                            </Box>
                                        }
                                        <Typography 
                                            fontSize="0.6rem" 
                                            fontWeight="200" 
                                            marginLeft="0.1rem" 
                                            alignSelf="flex-end"
                                            textAlign="right"
                                            width="100%"
                                        >
                                            {formattedTime}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )
                    })}
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" borderTop="1px solid rgba(255, 255, 255, 0.1)" height="13.06%" alignItems="center">
                <Box border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="50%" m="0 1rem 0 1rem" height="fit-content" sx={{backgroundColor: selectedFile ? 'white' : 'transparent'}}>
                    <input
                        accept="*"
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                        <IconButton component="span">
                            <AttachFileRounded sx={{ color: selectedFile ? 'black' : 'inherit' }}/>
                        </IconButton>
                    </label>
                </Box>
                <TextField variant="standard" fullWidth value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}/>
                <Box border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="50%" m="0 1rem 0 1rem" height="fit-content">
                    <IconButton onClick={handleSend}>
                        <SendRounded />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default GroupChatContent;