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
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] py-12 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FFFFFF]">Announcements</h1>
            <p className="text-[#EEF3FD] mt-1">Post platform-wide announcements</p>
          </div>
          <Link to="/admin" className="text-[#EEF3FD] hover:text-[#FFFFFF] text-sm">
            ← Back to dashboard
          </Link>
        </div>

        {/* Post Form */}
        <div className="bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-bold text-[#5B8DEF] mb-4">Post New Announcement</h2>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
          />
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] resize-none"
          />
          <select
            value={form.target}
            onChange={e => setForm({ ...form, target: e.target.value })}
            className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 mb-4 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
          >
            <option value="all">Everyone</option>
            <option value="students">Students only</option>
            <option value="teachers">Teachers only</option>
          </select>
          <button
            onClick={postAnnouncement}
            disabled={posting}
            className="bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-60"
          >
            {posting ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>

        {/* All Announcements */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-[#FFFFFF]/80 rounded-2xl p-6 animate-pulse h-20" />
          ) : announcements.length === 0 ? (
            <div className="bg-[#FFFFFF]/80 rounded-2xl p-8 text-center text-[#94A3B8]">
              No announcements yet.
            </div>
          ) : (
            announcements.map((a, i) => (
              <div key={i} className="bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-xl px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[#1E293B] font-semibold">{a.title}</p>
                    <p className="text-[#94A3B8] text-sm mt-1">{a.message}</p>
                    <p className="text-[#94A3B8] text-xs mt-2">
                      {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#EEF3FD] text-[#5B8DEF] whitespace-nowrap">
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

