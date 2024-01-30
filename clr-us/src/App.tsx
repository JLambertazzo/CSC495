import React from "react";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Home } from "./components/home/home";
import { AuthProvider } from "./context/context";
import { theme } from "./themes/theme";
import { Login } from "./components/login/login";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
                  <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
