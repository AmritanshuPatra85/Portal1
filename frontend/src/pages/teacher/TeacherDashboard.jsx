import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api.js'

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/my/courses')
        const allCourses = res?.data || []
        setCourses(Array.isArray(allCourses) ? allCourses : [])
      } catch (error) {
        console.error(error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const totalCourses = courses.length

  const totalEnrollments = useMemo(
    () => courses.reduce((sum, c) => sum + (Number(c.total_enrollments) || 0), 0),
    [courses]
  )

  const averageRating = useMemo(() => {
    if (courses.length === 0) return 0
    const sum = courses.reduce((s, c) => s + (Number(c.average_rating) || 0), 0)
    return sum / courses.length
  }, [courses])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <p className="text-xl font-bold text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-6xl p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-700">Teacher Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your courses</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/teacher/courses/new"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              + Create New Course
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalCourses}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Total Enrollments</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalEnrollments}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-slate-500 text-sm">Average Rating</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">
              {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-slate-600 py-10">
              No courses found.
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-800 leading-snug">
                    {course.title}
                  </h2>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    course.is_published
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price</span>
                    <span className="font-semibold">₹{course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Enrollments</span>
                    <span className="font-semibold">{Number(course.total_enrollments) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rating</span>
                    <span className="font-semibold">
                      {course.average_rating ? Number(course.average_rating).toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/teacher/courses/${course.id}/curriculum`}
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-300"
                  >
                    Manage Curriculum
                  </Link>
                  <Link
                    to={`/teacher/courses/${course.id}/edit`}
                    className="flex-1 text-center bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
