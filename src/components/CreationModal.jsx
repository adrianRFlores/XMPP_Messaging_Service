// JSDoc made by ChatGPT

import {
    Box,
    Typography,
    useTheme,
    Modal,
    TextField,
    Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Formik } from "formik";

/**
 * CreationModal component renders a modal dialog for user input, using Formik for form management.
 * 
 * @param {Object} props - Component properties.
 * @param {boolean} props.modalOpen - Boolean to control the modal's open state.
 * @param {function} props.toggleModal - Function to toggle the modal's open state.
 * @param {function} props.submitFunction - Function to handle form submission.
 * @param {Object} props.displayValues - Object containing the title and button text to display in the modal.
 * @returns {JSX.Element} The CreationModal component.
 */
const CreationModal = ({ modalOpen, toggleModal, submitFunction, displayValues }) => {
    const theme = useTheme();
    const palette = theme.palette;

    // Access user details from the redux store
    const userDetails = useSelector(state => state.xmpp.userDetails);

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
                sx={{ backdropFilter: 'blur(12px)' }}
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
                border="1px solid rgba(255, 255, 255, 0.1)"
                textAlign="center"
                marginLeft="23%"
                marginTop="32.3%"
                display="flex"
                flexDirection="column"
                p="0 3rem"
            >
                {/* Modal Title */}
                <Typography color="white" fontWeight="500" fontSize="1.2rem" m="0.5rem 0">
                    {displayValues.title}
                </Typography>
                
                {/* Formik form for user input */}
                <Formik
                    onSubmit={submitFunction}
                    initialValues={{ username: "" }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box maxWidth="100%" sx={{ display: 'flex', flexDirection: 'column' }} justifyContent="center" alignItems="center">
                                {/* Username input field */}
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
                                
                                {/* Submit button */}
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
