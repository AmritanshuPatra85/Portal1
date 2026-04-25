import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'

import AdminRoute from './components/AdminRoute.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* Private Routes */}
      <Route path='/' element={
        <PrivateRoute>
          <Navbar />
          <Home />
        </PrivateRoute>
      } />

      <Route path='/dashboard' element={
        <PrivateRoute>
          <Navbar />
          <Dashboard />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App
