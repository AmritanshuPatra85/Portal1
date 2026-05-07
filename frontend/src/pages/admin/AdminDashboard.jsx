import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api.js'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">
        <p className="text-xl font-bold text-[#FFFFFF]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FFFFFF]">Admin Dashboard</h1>
            <p className="text-[#EEF3FD] mt-1">Platform overview</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/users"
              className="bg-[#FFFFFF] text-[#5B8DEF] hover:bg-[#EEF3FD] px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/announcements"
              className="bg-[#FFFFFF] text-[#5B8DEF] hover:bg-[#EEF3FD] px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              Announcements
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#FFFFFF] text-[#5B8DEF] hover:bg-[#EEF3FD] px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Students', value: stats?.total_students ?? 0 },
            { label: 'Total Teachers', value: stats?.total_teachers ?? 0 },
            { label: 'Total Courses', value: stats?.total_courses ?? 0 },
            { label: 'Total Revenue', value: `₹${Number(stats?.total_revenue || 0).toFixed(2)}` },
          ].map(stat => (
            <div key={stat.label} className="bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-xl p-6">
              <p className="text-[#94A3B8] text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-[#1E293B] mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
          <p className="text-[#94A3B8] text-sm mb-4">Manage platform users — ban or unban accounts</p>
          <Link
            to="/admin/users"
            className="inline-block bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-8 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
          >
            Go to User Management →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
