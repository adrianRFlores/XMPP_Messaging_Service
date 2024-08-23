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
import { disconnectXmpp, xmppError } from '../../redux/actions';

const registerSchema = yup.object().shape({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
    name: yup.string()
});

const initialValuesRegister = {
    username: "",
    password: "",
    name: ""
};

const Form = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { authenticated, error } = useSelector(state => state.xmpp);
    let autherror = false;

    useEffect(() => {
		if (authenticated) {
			navigate('/home');
		}
    }, [authenticated, navigate]);

    const register = async (values, onSubmitProps) => {
      try {
        const clientObj = client({
          service: "ws://alumchat.lol:7070/ws",
          resource: "xmpp-client",
          sasl: ['SCRAM-SHA-1', 'PLAIN'],
        });
    
        return new Promise((resolve, reject) => {
          clientObj.on("error", (err) => {
            if (err.code === "ECONERROR") {
              console.error("Connection error:", err);
              clientObj.stop();
              clientObj.removeAllListeners();
              reject(new Error("Error in XMPP Client"));
            }
          });
    
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
    
          clientObj.on("stanza", async (stanza) => {

            if (stanza.is("iq") && stanza.getAttr("id") === "register-request") {
              await clientObj.stop();
              clientObj.removeAllListeners();
    
              if (stanza.getAttr("type") === "result") {
                resolve({ status: true, message: "Registration successful" });
              } else if (stanza.getAttr("type") === "error") {
                const error = stanza.getChild("error");
                if (error?.getChild("conflict")) {
                  reject(new Error("Error: Username already taken."));
                } else {
                  reject(new Error("An error occurred. Please try again!"));
                }
              }
            }
          });
    
          clientObj.start().catch((err) => {
            if (!err.message.includes("invalid-mechanism")) {
              reject(new Error("Failed to start XMPP client: " + err.message));
            }
          });
        });
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };

	
    
    const handleFormSubmit = async (values, onSubmitProps) => {
      register(values, onSubmitProps);
    };

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
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
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
    
              {/* BUTTONS */}
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
                <Box sx={{flexDirection: "column"}}>
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