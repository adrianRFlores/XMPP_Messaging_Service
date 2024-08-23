import {
    Box,
    Typography,
    Modal,
    IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification, addContact } from "../redux/actions";
import { Close, PersonAddAlt1 } from "@mui/icons-material";

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

const NotificationModal = ({ modalOpen, toggleModal }) => {
    const notifications = useSelector(state => state.xmpp.notifications);
    const roster = useSelector(state => state.xmpp.roster);
    const dispatch = useDispatch();
  
    const handleNotificationAcknowledge = (index, type) => {
        
        if (type === 'add') {
            dispatch(addContact(notifications[index].from.split('@')[0], 'subscribed'));
        }

        dispatch(removeNotification(index));

    };
  
    return (
      <Modal open={modalOpen} onClose={toggleModal}>
            <Box
                position="absolute"
                right="35%"
                top="30%"
                width="30%"
                height="fit-content"
                maxHeight="40%"
                backgroundColor="rgba(255, 255, 255, 0.05)"
                borderRadius="10px"
                sx={{ backdropFilter: 'blur(12px)', overflowY: 'auto' }}
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                textAlign="center"
                display="flex"
                flexDirection="column"
            >
                {notifications.filter(s => s.type === 'contact') && notifications.map((notification, index) => {
                    if ( notification.type === 'contact' ) {
                        let { formattedDate, formattedTime } = formatStamp(notification.date);
                        return (
                            <Box display="flex" borderTop={index === 0 ? "" : "1px solid rgba(255, 255, 255, 0.1)"} p="0 1.5rem" justifyContent="space-between" key={index}>
                                <Box display='flex' flexDirection="column" alignItems="flex-start">
                                    <Typography fontWeight="500" pt="0.5rem">{notification.title}</Typography>
                                    <Typography fontWeight="300">{notification.text}</Typography>
                                    <Typography fontWeight="200" fontSize="0.7rem" pb="0.5rem">{formattedTime}</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap="0.5rem">
                                    {notification.type === 'contact' && !roster.find(s => s.jid === notification.from) &&
                                        <IconButton onClick={() => {handleNotificationAcknowledge(index, 'add')}}>
                                            <PersonAddAlt1 />
                                        </IconButton>
                                    }
                                    <IconButton onClick={() => {handleNotificationAcknowledge(index, 'close')}}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    }
                })}
                {notifications.filter(s => s.type === 'contact').length === 0 && <Typography fontWeight="400" fontSize="1rem" p="0.5rem 0">Nothing to see here...</Typography>}
            </Box>
        </Modal>
    );
};

export default NotificationModal;
  