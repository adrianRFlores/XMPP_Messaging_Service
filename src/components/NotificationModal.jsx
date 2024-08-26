// JSDoc made by ChatGPT

import {
    Box,
    Typography,
    Modal,
    IconButton,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { removeNotification, addContact } from "../redux/actions";
import { Close, PersonAddAlt1 } from "@mui/icons-material";

/**
 * Formats a timestamp into a readable date and time format.
 *
 * @function formatStamp
 * @param {number} stamp - The timestamp to format.
 * @returns {Object} - An object containing the formatted date and time.
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
}

/**
 * NotificationModal component
 *
 * This component renders a modal displaying a list of notifications. Each notification can either be
 * acknowledged and removed or can be used to add a contact if it's a contact request.
 *
 * @component
 * @param {Object} props - The props that are passed to the component.
 * @param {boolean} props.modalOpen - Controls the visibility of the modal.
 * @param {Function} props.toggleModal - Function to toggle the modal's visibility.
 * @returns {JSX.Element} The NotificationModal component.
 */
const NotificationModal = ({ modalOpen, toggleModal }) => {
    const notifications = useSelector(state => state.xmpp.notifications); // Notifications from Redux store
    const roster = useSelector(state => state.xmpp.roster); // Roster from Redux store
    const dispatch = useDispatch();

    /**
     * Handles the acknowledgment of a notification. If the notification is a contact request,
     * it adds the contact; otherwise, it just removes the notification.
     *
     * @function handleNotificationAcknowledge
     * @param {number} index - The index of the notification in the list.
     * @param {string} type - The type of action to perform ('add' for adding a contact, 'close' for just closing).
     */
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
                    if (notification.type === 'contact') {
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
