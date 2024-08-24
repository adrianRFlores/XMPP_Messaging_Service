import { Box, Typography, useTheme, useMediaQuery, Modal, TextField, Button, IconButton } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChatContent from "../../components/ChatContent";
import './index.css';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { addContact, createGroup } from "../../redux/actions";
import StatusModal from "../../components/StatusModal";
import GroupChatContent from "../../components/GroupChatContent";
import NotificationModal from "../../components/NotificationModal";
import { Notifications } from "@mui/icons-material";
import { StyledBadge } from "../../components/StyledBadge";
import CreationModal from "../../components/CreationModal";

const addContactSchema = yup.object().shape({
  user: yup.string().required("Required").min(1),
});

const Home = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
	const messages = useSelector(state => state.xmpp.messages);
	const username = useSelector(state => state.xmpp.userDetails.username);
  const groupchats = useSelector(state => state.xmpp.groupchats);
  const notifications = useSelector(state => state.xmpp.notifications);

	const [currentTab, setCurrentTab] = useState('');
	const [currentMessages, setCurrentMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [creationType, setCreationType] = useState(true);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const toggleStatusModal = () => {
    setStatusModalOpen(!statusModalOpen);
  }

  const toggleNotificationsModal = () => {
    setNotificationsModalOpen(!notificationsModalOpen);
  }

  const handleAddContact = (values) => {
    dispatch(addContact(values.username, 'subscribe'));
  }

  const handleCreateGroup = (values) => {
    console.log('group', values)
    dispatch(createGroup(values.username));
  }

	useEffect(() => {
		if (currentTab.includes('alumchat.lol')) {
			setCurrentMessages(
				messages.filter((message) => message.to === currentTab || message.from === currentTab)
			)
		}
	}, [currentTab, messages])

    return (
      <div className="background">

        <CreationModal modalOpen={modalOpen} toggleModal={toggleModal} submitFunction={creationType ? handleAddContact : handleCreateGroup}
          displayValues={creationType ? {title: 'Add Contact', button: 'ADD'} : {title: 'Create Group', button: 'CREATE'}}
        />

        <StatusModal modalOpen={statusModalOpen} toggleModal={toggleStatusModal} />
        <NotificationModal modalOpen={notificationsModalOpen} toggleModal={toggleNotificationsModal} />

        <Box
          width="75%"
          height="80%"
          display="grid"
          backgroundColor="rgba(255, 255, 255, 0.05)"
          borderRadius="10px"
          sx={{backdropFilter: 'blur(12px)'}}
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          textAlign="center"
          gridTemplateColumns="1fr 3fr"
        >
          <Sidebar setCurrentTab={setCurrentTab} setModalOpen={toggleModal} setStatusModal={toggleStatusModal} setTabCreationType={setCreationType}/>
          {currentTab !== '' && !currentTab.includes('@conference') ? 
            <ChatContent messages={currentMessages} currentUser={username} selectedUser={currentTab} key={currentTab}/>
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