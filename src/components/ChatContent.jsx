import { Box, Typography, useTheme, IconButton, Icon, Avatar} from "@mui/material";
import { PersonAddAlt1Rounded, LogoutRounded } from "@mui/icons-material";
import { StyledBadge } from './StyledBadge';
import { useSelector, useDispatch } from 'react-redux';

const ChatContent = ({ messages, currentUser }) => {
    const dispatch = useDispatch();

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

    return (
        <Box>
            <Box height="8.7%" borderBottom="1px solid rgba(255, 255, 255, 0.1)" padding="0.5rem 0">
                hola
            </Box>
            <Box display="flex" flexDirection="column" sx={{overflowY: "auto"}}>
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
                                >
                                    {message.content}
                                </Box>
                            </Box>
                        </>
                    )
                })}
            </Box>
        </Box>
    );
};

export default ChatContent;