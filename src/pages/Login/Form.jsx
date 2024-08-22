import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { connectXmpp, disconnectXmpp } from '../../redux/actions';

const loginSchema = yup.object().shape({
    username: yup.string().required("Required"),
    password: yup.string().required("Required"),
});

const initialValuesLogin = {
    username: "",
    password: "",
};

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authenticated, error } = useSelector(state => state.xmpp);

	useEffect(() => {
        if (authenticated) {
            navigate('/home');
        }
    }, [authenticated, navigate]);

  const login = async (values, onSubmitProps) => {

    console.log(values)

    const credentials = {
      username: values.username,
      password: values.password,
      domain: 'alumchat.lol',
      websocketURL: 'ws://alumchat.lol:7070/ws/'
    }

    dispatch(connectXmpp(credentials));

  };
  
  const handleFormSubmit = async (values, onSubmitProps) => {
      login(values, onSubmitProps);
  };

    return (
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValuesLogin}
          validationSchema={loginSchema}
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
                  label="XMPP Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
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
			        {error && <Box>Login failed: {error.message}</Box>}
    
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
                  LOGIN
                </Button>
                <Box sx={{flexDirection: "column"}}>
                  <Typography>
                    Don't have an account?
                  </Typography>
                  <Typography
                    onClick={() => {
                      navigate('/register');
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: palette.primary.main,
                      "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.light,
                      },
                    }}>
                    Sign up here
                  </Typography>
                </Box>
                
              </Box>
            </form>
          )}
        </Formik>
    );

}

export default Form;