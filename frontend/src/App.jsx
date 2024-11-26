import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import Sidebar from './components/Sidebar.jsx'
import RightPanel from './components/RightPanel.jsx'
import NotificationPage from "./pages/notifications/Notificationpage.jsx"
import ProfilePage from './pages/profile/ProfilePage.jsx'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex max-w-6xl mx-auto">
        <Sidebar />
        <Routes>
            <Route path='/' element= {<HomePage />} />
            <Route path='/login' element= {<LoginPage />} />
            <Route path='/signup' element= {<SignUpPage />} />
            <Route path='/notifications' element= {<NotificationPage />} />
            <Route path='/profile/:user' element= {<ProfilePage />} />
            
            
        </Routes>
        <RightPanel />
    </div>
    </>
  )
}

export default App
