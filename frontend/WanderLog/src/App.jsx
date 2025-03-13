import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import React from 'react'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'

const App = () => {
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

//Define the Root component to handle the initial redirect
const Root = () => {
    //check if token exists in localStorage
    const isAuthenticated = !!localStorage.getItem("token");

    //redirect to direct if authenticated, otherwise to login
    return isAuthenticated ? (
        <Navigate to = "/dashboard" />
    ) : (
        <Navigate to= "/login" />
    );
};

export default App
