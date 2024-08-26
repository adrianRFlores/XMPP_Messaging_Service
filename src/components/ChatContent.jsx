// JSDoc made by ChatGPT

import { Box, Typography, Avatar, TextField, IconButton } from "@mui/material";
import { AttachFileRounded, SendRounded } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { sendMessage, sendFile } from "../redux/actions";

/**
 * ChatContent component displays chat messages between the current user and the selected user,
 * along with input fields to send new messages and attach files.
 * 
 * @param {Object} props - Component properties.
 * @param {Array} props.messages - Array of message objects to display.
 * @param {string} props.currentUser - The ID of the current user.
 * @param {string} props.selectedUser - The ID of the selected user to chat with.
 * @returns {JSX.Element} The ChatContent component.
 */
const ChatContent = ({ messages, currentUser, selectedUser }) => {
    const dispatch = useDispatch();
    const images = useSelector(state => state.xmpp.images);
    const roster = useSelector(state => state.xmpp.roster);

    // Find the selected user's image and details from the store
    const userImage = images.find(s => s.from === selectedUser);
    const user = roster.find(s => s.jid === selectedUser);

    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    /**
     * Handles file selection from the file input.
     * 
     * @param {Object} event - The event triggered by the file input.
     */
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    /**
     * Compares two timestamps to determine if they belong to different dates.
     * 
     * @param {string} lastDate - The timestamp of the previous message.
     * @param {string} currentDate - The timestamp of the current message.
     * @returns {boolean} - Returns true if the dates are different, otherwise false.
     */
    const drawDateTest = (lastDate, currentDate) => {
        const time1 = new Date(lastDate);
        const time2 = new Date(currentDate);

        return (
            time1.getFullYear() !== time2.getFullYear() ||
            time1.getMonth() !== time2.getMonth() ||
            time1.getDate() !== time2.getDate()
        );
    };

    /**
     * Formats a timestamp into a human-readable date and time.
     * 
     * @param {string} stamp - The timestamp to format.
     * @returns {Object} - An object containing formattedDate and formattedTime.
     */
    const formatStamp = (stamp) => {
        const date = new Date(stamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return { formattedDate: `${day}/${month}/${year}`, formattedTime: `${hours}:${minutes}` };
    };

    /**
     * Handles sending a message or a file when the send button is clicked.
     */
    const handleSend = () => {
        if (inputMessage) {
            dispatch(sendMessage(selectedUser, inputMessage, 'chat'));
            setInputMessage('');
        }
        if (selectedFile) {
            dispatch(sendFile(selectedUser, selectedFile));
            setSelectedFile(null);
        }
    };

    return (
        <Box display="flex" flexDirection="column" sx={{ overflowY: "hidden" }}>
            {/* Chat header with user information */}
            <Box height="86.94%" display="flex" flexDirection="column">
                <Box
                    height="12.6%"
                    borderBottom="1px solid rgba(255, 255, 255, 0.1)"
                    padding="0.5rem 0"
                    display="flex"
                    alignItems="center"
                    gap="1rem"
                    p="0 1rem"
                >
                    <Avatar sx={{ width: "match-parent", height: "match-parent" }} src={`data:image/jpeg;base64,${userImage?.image}`}>
                        {selectedUser.split('@')[0][0]}
                    </Avatar>
                    <Typography fontWeight="500" fontSize="1.2rem">
                        {selectedUser.split('@')[0]}
                    </Typography>
                    {user.name && (
                        <Typography fontWeight="300" fontSize="0.8rem">
                            {user.name}
                        </Typography>
                    )}
                </Box>

                {/* Messages display */}
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{ overflowY: "auto" }}
                    p="0 0 0.7rem 0"
                    height="87.4%"
                >
                    {messages.map((message, index) => {
                        const isUser = message.from.split('@')[0] === currentUser;
                        let shouldDrawDate = false;
                        const { formattedDate, formattedTime } = formatStamp(message.timestamp);

                        if (index > 0) {
                            shouldDrawDate = drawDateTest(message.timestamp, messages[index - 1].timestamp);
                        } else {
                            shouldDrawDate = true;
                        }

                        return (
                            <Box key={index}>
                                {shouldDrawDate && (
                                    <Typography
                                        marginTop="0.35rem"
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
                                                margin: "0 10px",
                                            },
                                        }}
                                    >
                                        {formattedDate}
                                    </Typography>
                                )}
                                <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
                                    <Box
                                        maxWidth="70%"
                                        width="fit-content"
                                        backgroundColor={isUser ? "rgba(255, 255, 255)" : ""}
                                        border={isUser ? "0" : "1px solid rgba(255, 255, 255, 0.1)"}
                                        borderRadius={isUser ? "15px 15px 0 15px" : "15px 15px 15px 0"}
                                        color={isUser ? "black" : "white"}
                                        padding="10px 15px"
                                        margin={isUser ? "0.35rem 1rem 0 0" : "0.35rem 0 0 1rem"}
                                        sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                                    >
                                        {message.image !== '' ? (
                                            <Box
                                                component="img"
                                                src={message.image}
                                                alt={message.content}
                                                maxWidth="100%"
                                                maxHeight="100%"
                                                borderRadius="15px"
                                                sx={{ objectFit: "contain" }}
                                            />
                                        ) : (
                                            <Box flexGrow="1" textAlign="justify">
                                                {message.content}
                                            </Box>
                                        )}
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
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Input section for message and file */}
            <Box display="flex" justifyContent="space-between" borderTop="1px solid rgba(255, 255, 255, 0.1)" height="13.06%" alignItems="center">
                <Box
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    borderRadius="50%"
                    m="0 1rem 0 1rem"
                    height="fit-content"
                    sx={{ backgroundColor: selectedFile ? 'white' : 'transparent' }}
                >
                    <input
                        accept="*"
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                        <IconButton component="span">
                            <AttachFileRounded sx={{ color: selectedFile ? 'black' : 'inherit' }} />
                        </IconButton>
                    </label>
                </Box>
                <TextField
                    variant="standard"
                    fullWidth
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
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
