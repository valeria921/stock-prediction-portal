import { useState } from 'react'
import './assets/css/style.css'
import Header from './components/Header'
import Home from './components/Home'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from './components/Register'
import Login from './components/Login'
import AuthProvider from './AuthProvider'
import { AuthContext } from './AuthProvider'
import Dashboard from './components/dashboard/Dashboard'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'


function App() {

  return (
    <>
      <AuthProvider>
        <BrowserRouter >
        <Header />
          <Routes>
            <Route path ='/' element = {<Home />}/>
            <Route path='/register' element = {<PublicRoute>< Register /></PublicRoute>} />
            <Route path='login' element={<PublicRoute><Login /></PublicRoute>} />
            <Route path='/dashboard' element= {<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
