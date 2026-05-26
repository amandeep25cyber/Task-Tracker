import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/sign-in' element={<Login/>}/>
      <Route path='/sign-up' element={<Register/>}/>
    </Routes>
    </>
  )
}

export default App