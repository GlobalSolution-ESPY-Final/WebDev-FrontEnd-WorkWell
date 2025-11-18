import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Skills from './pages/Skills'
import Motivational from './pages/Motivational'
import Networking from './pages/Networking'
import Account from './pages/Account'
import PrivateRoute from './components/PrivateRoute'


export default function App() {
	const [theme, setTheme] = useState(() => localStorage.getItem('workwell_theme') || 'dark');

	useEffect(() => {
		if (theme === 'light') {
			document.body.classList.add('theme-light');
			document.body.classList.remove('theme-dark');
		} else {
			document.body.classList.add('theme-dark');
			document.body.classList.remove('theme-light');
		}
		localStorage.setItem('workwell_theme', theme);
	}, [theme]);

	useEffect(() => {
		function onThemeChange(e) {
			const next = e?.detail;
			if (next === 'light' || next === 'dark') setTheme(next);
		}
		window.addEventListener('workwell-theme-change', onThemeChange);
		return () => window.removeEventListener('workwell-theme-change', onThemeChange);
	}, []);

	return (
		<div className="min-h-screen text-white">
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/skills" element={<Skills />} />
					<Route path="/motivational" element={<Motivational />} />
					<Route path="/networking" element={<Networking />} />
					<Route path="/account" element={<Account />} />
				</Route>
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</div>
	);
}
