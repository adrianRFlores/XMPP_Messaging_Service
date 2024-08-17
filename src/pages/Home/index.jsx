import { Box, Typography, useTheme, useMediaQuery, Modal, TextField, Button } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChatContent from "../../components/ChatContent";
import './index.css';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { addContact } from "../../redux/actions";

const addContactSchema = yup.object().shape({
  user: yup.string().required("Required"),
});

const Home = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
	const messages = useSelector(state => state.xmpp.messages);
	const username = useSelector(state => state.xmpp.userDetails.username);

	const [currentTab, setCurrentTab] = useState('');
	const [currentMessages, setCurrentMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  const handleAddContact = (values) => {
    //console.log(values);
    dispatch(addContact(values.username));
  }

	useEffect(() => {
		if (currentTab.includes('@alumchat.lol')) {
			setCurrentMessages(
				messages.filter((message) => message.to === currentTab || message.from === currentTab)
			)
		}
	}, [currentTab])

    return (
      <div className="background">

        <Modal 
          open={modalOpen}
          onClose={toggleModal}
        >
          <Box
            width="30%"
            height="25%"
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            sx={{backdropFilter: 'blur(12px)'}}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            position="absolute"
            top="59%"
            right="50%"
            display="flex"
            flexDirection="column"
          >
            <Typography color="white" fontWeight="500" fontSize="1.2rem" m="1rem 0">Add Contact</Typography>
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
                      label="Username"
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
                        m: "1rem 0 0 0",
                        p: "0.25rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                      }}
                    >
                      ADD
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>

          </Box>
        </Modal>

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
          <Sidebar setCurrentTab={setCurrentTab} setModalOpen={toggleModal}/>
          {currentTab && <ChatContent messages={currentMessages} currentUser={username} selectedUser={currentTab}/>}
        </Box>
      </div>
    );
};

export default Home;