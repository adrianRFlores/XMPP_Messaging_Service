import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ChatContent from "../../components/ChatContent";
import './index.css';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
	const messages = useSelector(state => state.xmpp.messages);
	const username = useSelector(state => state.xmpp.userDetails.username);

	const [currentTab, setCurrentTab] = useState('');
	const [currentMessages, setCurrentMessages] = useState([]);

	useEffect(() => {
		if (currentTab.includes('@alumchat.lol')) {
			setCurrentMessages(
				messages.filter((message) => message.to === currentTab || message.from === currentTab)
			)
		}
	}, [currentTab])

    return (
      <div className="background">

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
          <Sidebar setCurrentTab={setCurrentTab}/>
          {currentTab && <ChatContent messages={currentMessages} currentUser={username}/>}
        </Box>
      </div>
    );
};

export default Home;