// Documentation and comments made by ChatGPT

import { useMemo } from 'react'; // Hook to optimize performance by memoizing expensive calculations
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"; // Components for routing in a React app
import Login from "./pages/Login"; // Login page component
import Home from "./pages/Home"; // Home page component
import { useSelector } from "react-redux"; // Redux Provider and hook for accessing the Redux store
import { CssBaseline, ThemeProvider } from "@mui/material"; // Material-UI components for theming and CSS reset
import { createTheme } from "@mui/material/styles"; // Function to create custom Material-UI themes
import { themeSettings } from "./theme"; // Custom theme settings
import './App.css'; // Global CSS styles
import Register from './pages/Register'; // Register page component

function App() {
  // Memoizing the theme object to avoid unnecessary recalculations on re-renders
  // The theme is set to 'dark' mode using the custom themeSettings function
  const theme = useMemo(() => createTheme(themeSettings('dark')), ['dark']);

  // Accessing authentication state and error from the Redux store
  // If the state is not available, default to an empty object to prevent errors
  const { authenticated, error } = useSelector(state => state.xmpp || {});

  return (
      <div className="app">
        {/* BrowserRouter provides the routing context for the app */}
        <BrowserRouter>
          {/* ThemeProvider applies the custom theme across the application */}
          <ThemeProvider theme={theme}>
            {/* CssBaseline provides a consistent baseline to build upon */}
            <CssBaseline />
            {/* Defining the routes for the application */}
            <Routes>
              {/* Route for the Login page */}
              <Route path='/' element={<Login />} />
              {/* Route for the Register page */}
              <Route path='/register' element={<Register />} />
              {/* Route for the Home page, redirects to Login if not authenticated */}
              <Route path='/home' element={authenticated ? <Home /> : <Navigate to="/" />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
  )
}

export default App;
