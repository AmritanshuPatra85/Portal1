import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AddStudent from './pages/AddStudent.jsx'
import StudentList from './pages/StudentList.jsx'
import EditStudent from './pages/EditStudent.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/add-student' element={<AddStudent />} />
      <Route path='/students' element={<StudentList />} />
      <Route path='/edit-student/:id' element={<EditStudent />} />

    </Routes>
  )
}




export default App