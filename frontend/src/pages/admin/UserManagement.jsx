import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api.js'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users')
        setUsers(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const toggleBan = async (userId) => {
    setTogglingId(userId)
    try {
      const res = await api.patch(`/admin/users/${userId}/ban`)
      const { is_banned } = res.data
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, is_banned: is_banned ? 1 : 0 } : u)
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle ban')
    } finally {
      setTogglingId(null)
    }
  }

  const changeRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole })
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change role')
    }
  }

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
            <h1 className="text-4xl font-bold text-[#FFFFFF]">User Management</h1>
            <p className="text-[#EEF3FD] mt-1">{users.length} total users</p>
          </div>
          <Link
            to="/admin"
            className="text-[#EEF3FD] hover:text-[#FFFFFF] text-sm"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8EDF2] bg-[#EEF3FD]">
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Name</th>
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Email</th>
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Role</th>
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Action</th>
                <th className="text-left px-6 py-4 text-[#94A3B8] font-semibold">Role Change</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-[#E8EDF2] hover:bg-[#F0F4F8] transition">
                  <td className="px-6 py-4 text-[#1E293B] font-medium">{user.full_name || '—'}</td>
                  <td className="px-6 py-4 text-[#94A3B8]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-[#EEF3FD] text-[#A78BFA]'
                        : user.role === 'teacher'
                        ? 'bg-[#EEF3FD] text-[#F9A852]'
                        : 'bg-[#EEF3FD] text-[#5B8DEF]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      user.is_banned
                        ? 'bg-red-100 text-red-700' /* TODO: map this color */
                        : 'bg-[#EEF3FD] text-[#6ECA97]'
                    }`}>
                      {user.is_banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleBan(user.id)}
                        disabled={togglingId === user.id}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50 ${
                          user.is_banned
                            ? 'bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF]'
                            : 'bg-red-500 hover:bg-red-600 text-[#FFFFFF]' /* TODO: map this color */
                        }`}
                      >
                        {togglingId === user.id ? '...' : user.is_banned ? 'Unban' : 'Ban'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'admin' && (
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="text-xs border border-[#E8EDF2] rounded-lg px-2 py-1 text-[#1E293B]"
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
