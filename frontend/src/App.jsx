import React from 'react'
import UserDetail from './pages/userDetail';
import { Routes, Route, Navigate } from "react-router-dom"
import View from './pages/View';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path="/userdetail" element={<UserDetail />} />
        <Route path="/view" element={<Navigate to="/" replace />} />
        <Route path='/view/:id' element={<View />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />        
    </>
  )
}

export default App