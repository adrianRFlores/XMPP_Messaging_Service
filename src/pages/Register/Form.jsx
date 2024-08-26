// Documentation and comments made by ChatGPT

import { useState, useEffect } from "react";
import { client, xml } from '@xmpp/client';
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { xmppError } from '../../redux/actions';

// Validation schema for the registration form using Yup
const registerSchema = yup.object().shape({
  username: yup.string().required("Required"),
  password: yup.string().required("Required"),
  name: yup.string()
});

// Initial form values
const initialValuesRegister = {
  username: "",
  password: "",
  name: ""
};

/**
 * Form component for user registration using XMPP.
 * Handles registration process and form validation.
 */
const Form = () => {
  // Access the MUI theme
  const { palette } = useTheme();
  // Set up Redux dispatch
  const dispatch = useDispatch();
  // React Router navigation
  const navigate = useNavigate();
  // Extract authentication state and error from Redux store
  const { authenticated, error } = useSelector(state => state.xmpp);

  /**
   * useEffect hook to redirect to home if authenticated.
   * Runs every time 'authenticated' or 'navigate' changes.
   */
  useEffect(() => {
    if (authenticated) {
      navigate('/home');
    }
  }, [authenticated, navigate]);

  /**
   * Registers a new user using XMPP protocol.
   * @param {Object} values - The form values containing username, password, and name.
   * @param {Object} onSubmitProps - Formik props for managing form state.
   * @returns {Promise} A promise that resolves with registration status or rejects with an error.
   */
  const register = async (values, onSubmitProps) => {
    try {
      // Initialize XMPP client
      const clientObj = client({
        service: "ws://alumchat.lol:7070/ws",
        resource: "xmpp-client",
        sasl: ['SCRAM-SHA-1', 'PLAIN'],
      });

      return new Promise((resolve, reject) => {
        // Handle client errors
        clientObj.on("error", (err) => {
          if (err.code === "ECONERROR") {
            console.error("Connection error:", err);
            clientObj.stop();
            clientObj.removeAllListeners();
            dispatch(xmppError({ message: 'Client Error' }));
            reject(new Error("Client Error"));
          }
        });

        // Send registration IQ stanza when the client connection opens
        clientObj.on("open", () => {
          const iq = xml(
            'iq',
            { type: 'set', id: 'register-request', to: "alumchat.lol" },
            xml('query', { xmlns: 'jabber:iq:register' },
              xml('username', {}, values.username),
              xml('password', {}, values.password),
              values.name ? xml('name', {}, values.name) : null
            )
          );
          clientObj.send(iq);
        });

        // Handle server response stanzas
        clientObj.on("stanza", async (stanza) => {
          if (stanza.is("iq") && stanza.getAttr("id") === "register-request") {
            await clientObj.stop();
            clientObj.removeAllListeners();

            if (stanza.getAttr("type") === "result") {
              dispatch(xmppError(undefined));
              resolve({ status: true, message: "Registration successful" });
            } else if (stanza.getAttr("type") === "error") {
              const error = stanza.getChild("error");
              if (error?.getChild("conflict")) {
                dispatch(xmppError({ message: 'User already exists' }));
                reject(new Error('User already exists'));
              } else {
                dispatch(xmppError({ message: 'Unknown Error' }));
                reject(new Error('Unknown Error'));
              }
            }
          }
        });

        // Start the XMPP client
        clientObj.start().catch((err) => {
          if (!err.message.includes("invalid-mechanism")) {
            dispatch(xmppError({ message: err.message }))
            reject(new Error("Failed to start XMPP client: " + err.message));
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Handles form submission.
   * Calls the register function and navigates to home if registration is successful.
   * @param {Object} values - The form values containing username, password, and name.
   * @param {Object} onSubmitProps - Formik props for managing form state.
   */
  const handleFormSubmit = async (values, onSubmitProps) => {
    register(values, onSubmitProps);
    if (!error) {
      alert('Registration Successful.');
      navigate('/');
    }
  };

  // JSX for the registration form
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesRegister}
      validationSchema={registerSchema}
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
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: "span 4" },
            }}
          >
            <TextField
              label="Username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              name="username"
              error={Boolean(touched.username) && Boolean(errors.username)}
              helperText={touched.username && errors.username}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name="name"
              error={Boolean(touched.name) && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          {error && <Box>Register failed: {error.message}</Box>}

          {/* Registration button and link to login page */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Register
            </Button>
            <Box sx={{ flexDirection: "column" }}>
              <Typography>
                Already have an account?
              </Typography>
              <Typography
                onClick={() => {
                  navigate('/');
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}>
                Log In
              </Typography>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
}

export default Form;
