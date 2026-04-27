import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import CreateCourse from './pages/teacher/CreateCourse.jsx';
import CurriculumBuilder from './pages/teacher/CurriculumBuilder.jsx';
import EditCourse from "./pages/teacher/EditCourse";

import AdminRoute from './components/AdminRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import Announcements from './pages/admin/Announcements.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Navbar />
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Navbar />
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <PrivateRoute>
            <Navbar />
            <CourseList />
          </PrivateRoute>
        }
      />

      <Route
        path="/courses/:id"
        element={
          <PrivateRoute>
            <Navbar />
            <CourseDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/courses/:id/learn"
        element={
          <PrivateRoute>
            <CoursePlayer />
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <PrivateRoute>
            <TeacherDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/courses/new"
        element={
          <PrivateRoute>
            <CreateCourse />
          </PrivateRoute>
        }
      />

      <Route
        path="/teacher/courses/:id/curriculum"
        element={
          <PrivateRoute>
            <CurriculumBuilder />
          </PrivateRoute>
        }
      />

      <Route path="/teacher/courses/:id/edit" element={<PrivateRoute><EditCourse /></PrivateRoute>} />
    
     <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
     <Route path="/admin/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
     <Route path="/admin/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
    </Routes>
  );
};

export default App;


