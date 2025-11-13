import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'


export default function PrivateRoute(){
const logged = !!localStorage.getItem('workwell_user')
if(!logged) return <Navigate to="/login" replace />
return (
<div>
<Outlet />
</div>
)
}