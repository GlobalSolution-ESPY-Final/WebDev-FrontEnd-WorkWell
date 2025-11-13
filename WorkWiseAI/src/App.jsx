import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Skills from './pages/Skills'
import Motivational from './pages/Motivational'
import Networking from './pages/Networking'
import Nav from './components/Nav'
import PrivateRoute from './components/PrivateRoute'


export default function App(){
return (
<div className="min-h-screen text-white">
<Routes>
<Route path="/login" element={<Login />} />


<Route element={<PrivateRoute />}>
<Route path="/" element={<Dashboard />} />
<Route path="/skills" element={<Skills />} />
<Route path="/motivational" element={<Motivational />} />
<Route path="/networking" element={<Networking />} />
</Route>


<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
</div>
)
}
