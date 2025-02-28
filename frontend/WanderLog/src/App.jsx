import { BrowserRouter, Routes, Route } from "react-router";
import React from 'react'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'

function App() {
  return ( 
    <BrowserRouter>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/Login" exact element={<Login />} />
      <Route path="/SignUp" exact element={<SignUp />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App