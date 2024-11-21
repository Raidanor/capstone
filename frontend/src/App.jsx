import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import SignUpPage from './pages/auth/signup/SignUpPage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import HomePage from './pages/auth/signup/home/HomePage.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex max-w-6xl mx-auto">
        <Routes>
            <Route path='/' element= {<HomePage />} />
            <Route path='/login' element= {<LoginPage />} />
            <Route path='/signup' element= {<SignUpPage />} />
        </Routes>
    </div>
    </>
  )
}

export default App
