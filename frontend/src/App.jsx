import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query"

import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import Sidebar from './components/Sidebar.jsx'
import RightPanel from './components/RightPanel.jsx'
import NotificationPage from "./pages/notifications/Notificationpage.jsx"
import ProfilePage from './pages/profile/ProfilePage.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'


function App() {
    const { data: authUser, isLoading } = useQuery({
		
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me")
				const data = await res.json()

                //console.log(data)
                console.log(data)
                

				if (data.error) return null

				if (!res.ok) { throw new Error(data.error || "Something went wrong")}
				
				return data;

			} catch (error) {
				throw new Error(error)
			}
		},
		retry: false,
	})

    if (isLoading){
        return(
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size="lg"/>
            </div>
        )
    }
    return (
        <>
        <div className="flex max-w-6xl mx-auto">
            { authUser && <Sidebar /> }
            <Routes>
                <Route path='/' element= { authUser ? <HomePage /> : <Navigate to="/login" />}/>
                <Route path='/login' element= { !authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path='/signup' element= { !authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path='/notifications' element= { authUser ? <NotificationPage /> : <Navigate to="/login" />} />
                <Route path='/profile/:user' element= { authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
            { authUser && <RightPanel /> }
            <Toaster />
        </div>
        </>
    )
}

export default App
