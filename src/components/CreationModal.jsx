import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Modal,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";

const CreationModal = ({ modalOpen, toggleModal, submitFunction, displayValues}) => {
    const theme = useTheme();
    const palette = theme.palette;
    const userDetails = useSelector(state => state.xmpp.userDetails);
    const dispatch = useDispatch();
  
    return (
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
            <Typography color="white" fontWeight="500" fontSize="1.2rem" m="0.5rem 0">{displayValues.title}</Typography>
            <Formik
                onSubmit={submitFunction}
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
                        {displayValues.button}
                    </Button>
                    </Box>
                </form>
                )}
            </Formik>

            </Box>
        </Modal>
    );
};

export default CreationModal;
  