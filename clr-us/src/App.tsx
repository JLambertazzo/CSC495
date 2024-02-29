import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

import {
  LearnPage,
  PostProblem,
  ProblemPage,
  QuizPage,
  ViewProblem,
} from '@/components/course-page'
import { ProblemRoutes, RouteList } from '@/enum'

import { Home } from './components/home/home'
import { Login } from './components/login/login'
import { AuthProvider, SnackbarProvider } from './context/context'
import { theme } from './themes/theme'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* In the future, the id should be replaced by something that makes sense like csc373w24 */}
              <Route path="/:id" element={<LearnPage />} />
              <Route path={`/:id/${RouteList.Learn}`} element={<LearnPage />} />
              {(Object.values(ProblemRoutes) as Array<ProblemRoutes>).map((value) => (
                <>
                  <Route
                    key={value}
                    path={`/:id/${RouteList.Learn}/${value}`}
                    element={<ProblemPage />}
                  />
                  <Route
                    key={value}
                    path={`/:id/${RouteList.Learn}/${value}/${RouteList.Post}`}
                    element={<PostProblem />}
                  />
                  <Route
                    key={value}
                    path={`/:id/${RouteList.Learn}/${value}/:problemId`}
                    element={<ViewProblem />}
                  />
                </>
              ))}
              <Route path={`/:id/${RouteList.Quizzes}`} element={<QuizPage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
export default App
