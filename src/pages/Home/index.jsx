import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import './index.css';

const Home = () => {
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
        <Sidebar />
        {/*<ChatContent />*/}
      </Box>
    </div>
  );
};

export default Home;