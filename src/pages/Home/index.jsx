// Documentation and comments made by ChatGPT

import { Box, IconButton, useTheme } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChatContent from "../../components/ChatContent";
import GroupChatContent from "../../components/GroupChatContent";
import StatusModal from "../../components/StatusModal";
import NotificationModal from "../../components/NotificationModal";
import CreationModal from "../../components/CreationModal";
import { Notifications } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addContact, createGroup } from "../../redux/actions";
import './index.css';
import * as yup from "yup";

// Validation schema for adding a contact
const addContactSchema = yup.object().shape({
  user: yup.string().required("Required").min(1),
});

/**
 * Home component is the main interface for the chat application.
 * It contains the sidebar, chat content, modals for various actions, 
 * and handles state management for different parts of the application.
 */
const Home = () => {
  const { palette } = useTheme(); // Get theme object from Material-UI
  const dispatch = useDispatch(); // Redux dispatch hook

  // Selectors to access Redux state
  const messages = useSelector(state => state.xmpp.messages);
  const username = useSelector(state => state.xmpp.userDetails.username);
  const groupchats = useSelector(state => state.xmpp.groupchats);
  const notifications = useSelector(state => state.xmpp.notifications);

  // State management
  const [currentTab, setCurrentTab] = useState(''); // Current chat or group tab
  const [currentMessages, setCurrentMessages] = useState([]); // Messages for the current tab
  const [modalOpen, setModalOpen] = useState(false); // State for creation modal
  const [statusModalOpen, setStatusModalOpen] = useState(false); // State for status modal
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false); // State for notifications modal
  const [creationType, setCreationType] = useState(true); // Determines if creating a contact or group

  /**
   * Toggles the creation modal open state.
   */
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  /**
   * Toggles the status modal open state.
   */
  const toggleStatusModal = () => {
    setStatusModalOpen(!statusModalOpen);
  }

  /**
   * Toggles the notifications modal open state.
   */
  const toggleNotificationsModal = () => {
    setNotificationsModalOpen(!notificationsModalOpen);
  }

  /**
   * Handles adding a new contact.
   *
   * @param {Object} values - The form values containing username for the contact.
   */
  const handleAddContact = (values) => {
    dispatch(addContact(values.username, 'subscribe'));
  }

  /**
   * Handles creating a new group.
   *
   * @param {Object} values - The form values containing group name.
   */
  const handleCreateGroup = (values) => {
    dispatch(createGroup(values.username));
  }

  // Effect to update current messages based on the selected tab
  useEffect(() => {
    if (currentTab.includes('alumchat.lol')) {
      setCurrentMessages(
        messages.filter((message) => message.to === currentTab || message.from === currentTab)
      )
    }
  }, [currentTab, messages])

  return (
    <div className="background">

      {/* Creation Modal for adding contacts or creating groups */}
      <CreationModal 
        modalOpen={modalOpen} 
        toggleModal={toggleModal} 
        submitFunction={creationType ? handleAddContact : handleCreateGroup}
        displayValues={creationType ? {title: 'Add Contact', button: 'ADD'} : {title: 'Create Group', button: 'CREATE'}}
      />

      {/* Status Modal */}
      <StatusModal modalOpen={statusModalOpen} toggleModal={toggleStatusModal} />

      {/* Notifications Modal */}
      <NotificationModal modalOpen={notificationsModalOpen} toggleModal={toggleNotificationsModal} />

      {/* Main Container for Sidebar and Chat Content */}
      <Box
        width="75%"
        height="80%"
        display="grid"
        backgroundColor="rgba(255, 255, 255, 0.05)"
        borderRadius="10px"
        sx={{ backdropFilter: 'blur(12px)' }}
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        textAlign="center"
        gridTemplateColumns="1fr 3fr"
      >
        {/* Sidebar for navigation and settings */}
        <Sidebar 
          setCurrentTab={setCurrentTab} 
          setModalOpen={toggleModal} 
          setStatusModal={toggleStatusModal} 
          setTabCreationType={setCreationType}
        />
        
        {/* Chat Content or Group Chat Content based on current tab */}
        {currentTab !== '' && !currentTab.includes('@conference') ? 
          <ChatContent 
            messages={currentMessages} 
            currentUser={username} 
            selectedUser={currentTab} 
            key={currentTab}
          />
          :
          <GroupChatContent
            messages={currentMessages}
            currentUser={username}
            selectedGroup={currentTab}
            name={groupchats.find(gc => gc.jid === currentTab)?.name}
            members={groupchats.find(gc => gc.jid === currentTab)?.members}
            key={currentTab} 
          />
        }
      </Box>

      {/* IconButton for Notifications Modal */}
      <IconButton 
        onClick={toggleNotificationsModal} 
        sx={{
          position: 'absolute',
          right: "2%",
          bottom: "4%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          scale: "120%",
          boxShadow: notifications.find(s => s.type === 'contact') ? "0px 0px 20px rgba(255, 255, 255, 0.3)" : ""
        }}
      >
        <Notifications />
      </IconButton>
    </div>
  );
};

export default Home;
