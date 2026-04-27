import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api.js'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState({ title: '', message: '', target: 'all' })
  const [posting, setPosting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements')
        setAnnouncements(res.data?.data || res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  const postAnnouncement = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      alert('Please provide both title and message')
      return
    }
    setPosting(true)
    try {
      await api.post('/announcements', {
        title: form.title,
        message: form.message,
        target: form.target
      })
      const res = await api.get('/announcements')
      setAnnouncements(res.data?.data || res.data || [])
      setForm({ title: '', message: '', target: 'all' })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Announcements</h1>
            <p className="text-emerald-100 mt-1">Post platform-wide announcements</p>
          </div>
          <Link to="/admin" className="text-emerald-100 hover:text-white text-sm">
            ← Back to dashboard
          </Link>
        </div>

        {/* Post Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">Post New Announcement</h2>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <select
            value={form.target}
            onChange={e => setForm({ ...form, target: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Everyone</option>
            <option value="students">Students only</option>
            <option value="teachers">Teachers only</option>
          </select>
          <button
            onClick={postAnnouncement}
            disabled={posting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60"
          >
            {posting ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>

        {/* All Announcements */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/80 rounded-2xl p-6 animate-pulse h-20" />
          ) : announcements.length === 0 ? (
            <div className="bg-white/80 rounded-2xl p-8 text-center text-slate-500">
              No announcements yet.
            </div>
          ) : (
            announcements.map((a, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-slate-800 font-semibold">{a.title}</p>
                    <p className="text-slate-600 text-sm mt-1">{a.message}</p>
                    <p className="text-slate-400 text-xs mt-2">
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                    {a.target}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Announcements

