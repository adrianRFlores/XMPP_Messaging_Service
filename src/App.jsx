import { useMemo } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
//import HomePage from "scenes/homePage";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import './App.css';

function App() {
  const theme = useMemo(() => createTheme(themeSettings('dark')), ['dark']);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path='/' element={<Login />} />
              {/*<Route path='/home' element={isAuth ? <Home /> : <Navigate to="/" />} />*/}
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
  )
}

export default App
