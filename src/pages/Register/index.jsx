import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import './index.css';

const Register = () => {
  const theme = useTheme();
  return (
    <div className="background">
      <Box
        width="30%"
        backgroundColor="rgba(255, 255, 255, 0.05)"
        borderRadius="10px"
        sx={{backdropFilter: 'blur(12px)'}}
        boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="600" fontSize="2.5rem" color="primary" p="0 0 1.5rem 0">
            Register
        </Typography>

        <Form />

      </Box>
    </div>
  );
};

export default Register;