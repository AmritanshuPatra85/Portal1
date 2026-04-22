import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AddStudent from './pages/AddStudent.jsx'
import StudentList from './pages/StudentList.jsx'
import EditStudent from './pages/EditStudent.jsx'
import Login from './pages/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/' element={
        <PrivateRoute>
          <Navbar />
          <Home />
        </PrivateRoute>
      } />
      <Route path='/add-student' element={
        <PrivateRoute>
          <Navbar />
          <AddStudent />
        </PrivateRoute>
      } />
      <Route path='/students' element={
        <PrivateRoute>
          <Navbar />
          <StudentList />
        </PrivateRoute>
      } />
      <Route path='/edit-student/:id' element={
        <PrivateRoute>
          <Navbar />
          <EditStudent />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App