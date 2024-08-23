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
      console.log(values);
  
      const clientObj = client({
        service: "ws://alumchat.lol:7070/ws/", // WebSocket service URL for XMPP server
        domain: 'alumchat.lol',                // Domain of the XMPP server
        sasl: ['SCRAM-SHA-1', 'PLAIN'], 
        resource: 'gajimbo2'                 // Resource name of the client
      });
  
      clientObj.on('open', async (address) => {
  
        // Wait for the stream to be ready before sending the registration request
        await clientObj.send(
            xml('iq', { type: 'set', id: 'reg1', to: 'alumchat.lol' },
                xml('query', { xmlns: 'jabber:iq:register' },
                    xml('username', {}, values.username),
                    xml('password', {}, values.password),
                    xml('name', {}, values.name ? values.name : '')
                )
            )
        ).catch((err) => {
            console.error('Registration error:', err);
            dispatch(xmppError({
                message: err.message,
                stack: err.stack,
                name: err.name,
            }));
        });
      });
  
      clientObj.on('error', (err) => {
          console.error('Connection Error:', err);
          dispatch(xmppError({
              message: err.message,
              stack: err.stack,
              name: err.name,
          }));
      });

      clientObj.on('stanza', (stanza) => {
        console.log(stanza)
        if (stanza.attrs.type === 'result') {
            // Stop the client after registration
            onSubmitProps.setSubmitting(false);
            dispatch(disconnectXmpp());
            alert('Registration Successful! Please log in to continue.');
            clientObj.stop();
            navigate('/');
        } else if (stanza.attrs.type === 'error') {
            dispatch(xmppError({
                message: stanza.getChildText('conflict'),
                stack: '',
                name: stanza.getChild('error').code,
            }));
            onSubmitProps.setSubmitting(false);
            //clientObj.stop();
        }
      })
  
      clientObj.start().catch(console.error);
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