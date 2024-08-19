import { Box, Typography, useTheme, IconButton, Icon, Avatar, TextField} from "@mui/material";
import { AttachFileRounded, SendRounded } from "@mui/icons-material";
import { StyledBadge } from './StyledBadge';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { sendMessage, sendFile } from "../redux/actions";

const ChatContent = ({ messages, currentUser, selectedUser }) => {
    const dispatch = useDispatch();
    const images = useSelector(state => state.xmpp.images);
    const userImage = images.find(s => s.from === selectedUser);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const drawDateTest = (lastDate, currentDate) => {
        const time1 = new Date(lastDate);
        const time2 = new Date(currentDate);

        return (
            time1.getUTCFullYear() !== time2.getUTCFullYear() ||
            time1.getUTCMonth() !== time2.getUTCMonth() ||
            time1.getUTCDate() !== time2.getUTCDate()
        );
    }

    const formatStamp = (stamp) => {
        const date = new Date(stamp);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}`;

        return { formattedDate, formattedTime };
    }

    const handleSend = () => {
        if (inputMessage) {
            console.log(selectedUser)
            dispatch(sendMessage(selectedUser, inputMessage, 'chat'));
            setInputMessage('')
        }
        if (selectedFile) {

            dispatch(sendFile(selectedUser, selectedFile));
            //console.log('File to upload:', selectedFile);
            setSelectedFile(null);
        }
    }

    return (
        <Box display="flex" flexDirection="column" sx={{overflowY: "hidden"}}>
            <Box height="86.94%" display="flex" flexDirection="column">
                <Box height="12.6%" borderBottom="1px solid rgba(255, 255, 255, 0.1)" padding="0.5rem 0" display="flex" alignItems="center" gap="1rem" p="0 1rem">
                    <Avatar sx={{ width: "match-parent", height: "match-parent"}} src={`data:image/jpeg;base64,${userImage?.image}`}>{selectedUser.split('@')[0][0]}</Avatar>
                    <Typography fontWeight="500" fontSize="1.2rem">{selectedUser.split('@')[0]}</Typography>
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
                                <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
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
                                        overflowWrap: "break-word"}}
                                    >
                                        <Box flexGrow="1" textAlign="justify">
                                            {message.content}
                                        </Box>
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
                <Box border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="50%" m="0 1rem 0 1rem" height="fit-content">
                    <input
                        accept="*"
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                        <IconButton component="span">
                            <AttachFileRounded />
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

export default ChatContent;