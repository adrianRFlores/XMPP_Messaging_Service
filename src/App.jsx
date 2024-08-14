import { useMemo } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Provider, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import './App.css';

// Almost all UI elements and Form Functionality was taken from 

function App() {
  const theme = useMemo(() => createTheme(themeSettings('dark')), ['dark']);
  const { authenticated, error } = useSelector(state => state.xmpp || {});

  return (
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/home' element={authenticated ? <Home /> : <Navigate to="/" />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
  )
}

export default App
