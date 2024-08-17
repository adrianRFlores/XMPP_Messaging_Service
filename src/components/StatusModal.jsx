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
import * as yup from "yup";
import { updateUserDetails } from "../redux/actions";

const stateOptions = [
    {display: 'Online', value: 'chat'},
    {display: 'Away', value: 'away'},
    {display: 'Extended Away', value: 'xa'},
    {display: 'Do Not Disturb', value: 'dnd'}
];

const colorMapping = {
    'dnd': 'red',
    'chat': 'green',
    'xa': 'orange',
    'away': 'yellow'
};

const StatusModal = ({ modalOpen, toggleModal }) => {
    const theme = useTheme();
    const palette = theme.palette;
    const userDetails = useSelector(state => state.xmpp.userDetails);
    const dispatch = useDispatch();
  
    const validationSchema = yup.object().shape({
        status: yup.string().required("Status is required"),
        presenceMsg: yup.string().max(100, "Message must be 100 characters or less"),
    });
  
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log(values);
        
        dispatch(updateUserDetails(values.status, values.presenceMsg));

        setSubmitting(false);
        resetForm();
        toggleModal();
    };
  
    return (
      <Modal open={modalOpen} onClose={toggleModal}>
        <Box
            width="fit-content"
            height="fit-content"
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius="10px"
            sx={{ backdropFilter: 'blur(12px)' }}
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.15)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            textAlign="center"
            marginLeft="13%"
            marginTop="29.45%"
            display="flex"
            flexDirection="column"
            p="0 3rem"
        >
          <Formik
                onSubmit={handleSubmit}
                initialValues={{ status: userDetails.status, presenceMsg: userDetails.presenceMsg }}
                validationSchema={validationSchema}
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
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <Box
                        maxWidth="100%"
                        sx={{ display: 'flex', flexDirection: 'column' }}
                        justifyContent="center"
                        alignItems="center"
                    >
                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }} margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                        name="status"
                        value={values.status}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={Boolean(touched.status) && Boolean(errors.status)}
                        >
                        {stateOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            <Box backgroundColor={colorMapping[option.value]} borderRadius="50%" width="0.5rem" height="0.5rem" marginRight="0.5rem"/>
                            {option.display}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    {Boolean(touched.status) && Boolean(errors.status) && (
                        <Typography color="error" variant="caption">
                        {errors.status}
                        </Typography>
                    )}
  
                    <TextField
                        variant="standard"
                        fullWidth
                        label="Presence Message"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.presenceMsg}
                        name="presenceMsg"
                        error={Boolean(touched.presenceMsg) && Boolean(errors.presenceMsg)}
                        helperText={touched.presenceMsg && errors.presenceMsg}
                        sx={{ mb: 2 }}
                    />
    
                    <Button
                        type="submit"
                        sx={{
                        width: "fit-content",
                        m: "1rem 0 1rem 0",
                        p: "0.25rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                        "&:disabled": { backgroundColor: "rgba(255,255,255,0.05)" }
                        }}
                        disabled={Boolean(errors.status) || Boolean(errors.presenceMsg)}
                    >
                        SUBMIT
                    </Button>
                    </Box>
                </form>
                )}
            </Formik>
            </Box>
        </Modal>
    );
};

export default StatusModal;
  