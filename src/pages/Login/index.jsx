// Documentation and comments made by ChatGPT

import { Box, Typography, useTheme } from "@mui/material";
import Form from "./Form";
import './index.css';

/**
 * Login component renders the login page layout.
 * It displays a styled container with the application name and the registration form.
 */
const Login = () => {
  // Access the Material-UI theme
  const theme = useTheme();

  return (
    <div className="background">
      <Box
        width="30%"
        backgroundColor="rgba(255, 255, 255, 0.05)"
        borderRadius="10px"
        sx={{ backdropFilter: 'blur(12px)' }}
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        p="1rem 6%"
        textAlign="center"
      >
        {/* Application title */}
        <Typography fontWeight="600" fontSize="2.5rem" color="primary" p="0 0 1.5rem 0">
          Gajimbo
        </Typography>

        {/* Registration form component */}
        <Form />
      </Box>
    </div>
  );
};

export default Login;
