import { Box, Typography, useTheme, useMediaQuery, Modal, TextField, Button, IconButton } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChatContent from "../../components/ChatContent";
import './index.css';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { addContact } from "../../redux/actions";
import StatusModal from "../../components/StatusModal";
import GroupChatContent from "../../components/GroupChatContent";
import NotificationModal from "../../components/NotificationModal";
import { Notifications } from "@mui/icons-material";
import { StyledBadge } from "../../components/StyledBadge";

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
    //console.log(values);
    dispatch(addContact(values.username, 'subscribe'));
  }

  const handleCreateGroup = (values) => {
    dispatch();
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

        <Modal 
          open={modalOpen}
          onClose={toggleModal}
        >
          <Box
            width="fit-content"
            height="fit-content"
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            sx={{backdropFilter: 'blur(12px)'}}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            marginLeft="23%"
            marginTop="32.3%"
            display="flex"
            flexDirection="column"
            p="0 3rem"
          >
            <Typography color="white" fontWeight="500" fontSize="1.2rem" m="0.5rem 0">Add Contact</Typography>
            <Formik
              onSubmit={handleAddContact}
              initialValues={{user: ""}}
              display='flex'
              flexDirection='column'
            >
              {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
              }) => (
                <form onSubmit={handleSubmit} display="flex">
                  <Box maxWidth="100%" sx={{display:'flex', flexDirection:'column'}} justifyContent="center" alignItems="center">
                    <TextField
                      variant="standard"
                      width="60%"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                      name="username"
                      error={Boolean(touched.username) && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      sx={{
                        width: "fit-content",
                        m: "1rem 0 1rem 0",
                        p: "0.25rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                      disabled={Boolean(touched.username) && Boolean(errors.username)}
                    >
                      ADD
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>

          </Box>
        </Modal>

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