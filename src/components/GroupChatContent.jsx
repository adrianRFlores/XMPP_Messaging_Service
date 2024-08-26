// JSDoc made by ChatGPT

import { Box, Typography, IconButton, Avatar, TextField } from "@mui/material";
import { AttachFileRounded, SendRounded } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { sendMessage, sendFile } from "../redux/actions";

/**
 * GroupChatContent component displays a chat interface for a group chat, allowing users
 * to send messages and files, and view messages from group members.
 * 
 * @param {Object} props - Component properties.
 * @param {Array} props.messages - Array of message objects to be displayed in the chat.
 * @param {string} props.currentUser - The username of the current user.
 * @param {string} props.selectedGroup - The ID of the selected group chat.
 * @param {string} props.name - The display name of the group.
 * @param {Array} props.members - Array of member usernames in the group.
 * @returns {JSX.Element} The GroupChatContent component.
 */
const GroupChatContent = ({ messages, currentUser, selectedGroup, name, members }) => {
    const dispatch = useDispatch();
    
    // Access images and user details from the redux store
    const images = useSelector(state => state.xmpp.images);
    const selfImage = useSelector(state => state.xmpp.userDetails.profilePic);

    // State hooks to manage input message and file selection
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Create a string of group member usernames
    let membersString = members?.map(member => member.split('@')[0]).join(', ');

    /**
     * Handles file input change event, updates the selected file state.
     * 
     * @param {Object} event - The file input change event.
     */
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    /**
     * Determines whether to display the date for a given message.
     * 
     * @param {string} lastDate - The timestamp of the previous message.
     * @param {string} currentDate - The timestamp of the current message.
     * @returns {boolean} Whether the date should be displayed.
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
     * Formats a timestamp into a date and time string.
     * 
     * @param {string} stamp - The timestamp to format.
     * @returns {Object} An object containing formatted date and time strings.
     */
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
    };

    /**
     * Handles the sending of a message or a file.
     * If there is an input message, it sends the message.
     * If a file is selected, it sends the file.
     */
    const handleSend = () => {
        if (inputMessage) {
            console.log(selectedGroup);
            dispatch(sendMessage(selectedGroup, inputMessage, 'groupchat'));
            setInputMessage('');
        }
        if (selectedFile) {
            dispatch(sendFile(selectedGroup, selectedFile, 'groupchat'));
            console.log('File to upload:', selectedFile);
            setSelectedFile(null);
            document.getElementById('file-input').value = '';
        }
    };

    return (
        <Box display="flex" flexDirection="column" sx={{ overflowY: "hidden" }}>
            {/* Header of the group chat, displaying the group name and members */}
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
                    <Avatar sx={{ width: "match-parent", height: "match-parent" }}>
                        {selectedGroup.split('@')[0][0]}
                    </Avatar>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Typography fontWeight="500" fontSize="1.2rem">
                            {name}
                        </Typography>
                        <Typography fontWeight="300" fontSize="0.8rem">
                            {membersString?.length > 60 ? membersString.slice(0, 60) + '...' : membersString}
                        </Typography>
                    </Box>
                </Box>

                {/* Chat messages display area */}
                <Box
                    display="flex"
                    flexDirection="column"
                    sx={{ overflowY: "auto" }}
                    p="0 0 0.7rem 0"
                    height="87.4%"
                >
                    {messages.map((message, index) => {
                        let isUser = message.ofrom.split('@')[0] === currentUser;
                        let shouldDrawDate = false;
                        let { formattedDate, formattedTime } = formatStamp(message.timestamp);
                        let userImage = isUser
                            ? images.find(s => s.from === `${currentUser}@alumchat.lol`)
                            : images.find(s => s.from === message.ofrom);

                        if (index > 0) {
                            shouldDrawDate = drawDateTest(message.timestamp, messages[index - 1].timestamp);
                        } else {
                            shouldDrawDate = true;
                        }

                        return (
                            <>
                                {/* Display date separator if required */}
                                {shouldDrawDate && (
                                    <Typography
                                        marginTop="0.35rem"
                                        key={index + 20}
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
                                )}

                                {/* Display individual message */}
                                <Box display="flex" justifyContent={isUser ? "flex-end" : "flex-start"}>
                                    {/* Display avatar for non-user messages */}
                                    {!isUser && (
                                        <Avatar src={userImage} sx={{ alignSelf: "end", marginLeft: "10px" }}>
                                            {message.ofrom.split('@')[0][0]}
                                        </Avatar>
                                    )}
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
                                        sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word"
                                        }}
                                    >
                                        <Typography fontWeight="500" textAlign={isUser ? "right" : "left"}>
                                            {message.ofrom.split('@')[0]}
                                        </Typography>
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

                                    {/* Display avatar for user messages */}
                                    {isUser && (
                                        <Avatar src={`data:image/jpeg;base64,${selfImage}`} sx={{ alignSelf: "end", marginRight: "10px" }}>
                                            {message.ofrom.split('@')[0][0]}
                                        </Avatar>
                                    )}
                                </Box>
                            </>
                        );
                    })}
                </Box>
            </Box>

            {/* Message input area */}
            <Box display="flex" justifyContent="space-between" borderTop="1px solid rgba(255, 255, 255, 0.1)" height="13.06%" alignItems="center">
                <Box border="1px solid rgba(255, 255, 255, 0.1)" borderRadius="50%" m="0 1rem 0 1rem" height="fit-content" sx={{ backgroundColor: selectedFile ? 'white' : 'transparent' }}>
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
                <TextField variant="standard" fullWidth value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
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
