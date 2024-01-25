import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Home } from "./components/home/home";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;
