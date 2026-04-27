import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const Dashboard = () => {
  const [profile, setProfile] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, enrollRes] = await Promise.all([
          api.get('/profiles/me'),
          api.get('/enrollments/my'),
        ])
        setProfile(profileRes.data?.data || profileRes.data)
        setEnrollments(enrollRes.data?.data || enrollRes.data || [])
        setAnnouncements([])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] || 'Student'
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / enrollments.length)
    : 0
  const inProgress = enrollments.filter(e => {
    const p = e.progress_percent || 0
    return p > 0 && p < 100
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">

      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-lg">EduVora</h1>
        <p className="text-emerald-100 mt-2 text-lg">Your learning journey</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">

        {/* Welcome Banner */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-6 mb-6">
          {loading ? (
            <div className="h-7 w-48 bg-emerald-100 rounded animate-pulse" />
          ) : (
            <>
              <h2 className="text-2xl font-bold text-emerald-700">Welcome back, {firstName} 👋</h2>
              <p className="text-slate-600 mt-1">Pick up where you left off.</p>
              <Link
                to="/profile"
                className="inline-block mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-300 shadow-md"
              >
                Edit Profile
              </Link>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Enrolled', value: loading ? '—' : enrollments.length, sub: 'total courses' },
            { label: 'In Progress', value: loading ? '—' : inProgress, sub: 'active now' },
            { label: 'Avg. Progress', value: loading ? '—' : `${avgProgress}%`, sub: 'across all courses' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 text-white shadow-lg">
              <p className="text-emerald-100 text-sm uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              <p className="text-emerald-100 text-xs mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mb-6">
          <h3 className="text-white font-semibold text-lg mb-3 tracking-wide">My Courses</h3>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white/80 rounded-2xl shadow-xl overflow-hidden animate-pulse">
                  <div className="h-36 bg-emerald-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-emerald-100 rounded w-3/4" />
                    <div className="h-3 bg-emerald-100 rounded w-1/2" />
                    <div className="h-2 bg-emerald-100 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-slate-600">You haven't enrolled in any courses yet.</p>
              <Link
                to="/courses"
                className="inline-block mt-4 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-300 shadow-md"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {enrollments.map((enrollment, i) => {
                const pct = Math.round(enrollment.progress_percent || 0)
                const title = enrollment.title || enrollment.course_title || 'Untitled Course'
                const instructor = enrollment.instructor_name || enrollment.teacher_name || 'Instructor'
                const gradients = [
                  'from-emerald-500 to-teal-600',
                  'from-teal-500 to-cyan-600',
                  'from-emerald-600 to-green-700',
                  'from-cyan-500 to-teal-600',
                ]
                const icons = ['📚', '💻', '🎨', '🔬', '📊', '🎯']
                return (
                  <Link
                    to={`/courses/${enrollment.course_id}`}
                    key={enrollment.enrollment_id || i}
                    className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className={`h-36 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-4xl`}>
                      {icons[i % icons.length]}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      <span className="inline-block text-xs font-semibold px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 mb-2">
                        Enrolled
                      </span>
                      <h4 className="text-slate-800 font-semibold text-base leading-snug mb-1">{title}</h4>
                      <p className="text-slate-500 text-xs mb-4">By {instructor}</p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 min-w-[32px] text-right">{pct}%</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3 tracking-wide">Announcements</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-14 bg-white/20 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-4 text-emerald-100 text-sm">
              No announcements yet.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.slice(0, 4).map((a, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-lg rounded-xl px-6 py-4 shadow-lg flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-700 text-sm leading-relaxed">{a.message || a.content || a.title}</p>
                    {a.created_at && (
                      <p className="text-slate-400 text-xs mt-1">
                        {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-emerald-700 text-white text-center py-4 text-sm tracking-wide">
        Happy Learning 🚀
      </footer>
    </div>
  )
}

export default Dashboard
