import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

import { CoursePage } from '@/components/course-page'

import { Home } from './components/home/home'
import { Login } from './components/login/login'
import { AuthProvider } from './context/context'
import { theme } from './themes/theme'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:id" element={<CoursePage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
