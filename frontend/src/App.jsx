import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AddStudent from './pages/AddStudent.jsx'
import StudentList from './pages/StudentList.jsx'
import EditStudent from './pages/EditStudent.jsx'
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

      {/* Admin Routes ONLY */}
      <Route path='/students' element={
        <PrivateRoute>
          <AdminRoute>
            <Navbar />
            <StudentList />
          </AdminRoute>
        </PrivateRoute>
      } />

      <Route path='/add-student' element={
        <PrivateRoute>
          <AdminRoute>
            <Navbar />
            <AddStudent />
          </AdminRoute>
        </PrivateRoute>
      } />

      <Route path='/edit-student/:id' element={
        <PrivateRoute>
          <AdminRoute>
            <Navbar />
            <EditStudent />
          </AdminRoute>
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App