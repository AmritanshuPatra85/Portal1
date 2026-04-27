import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api.js'

const Profile = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    mobile: '',
    dob: '',
    bio: '',
    avatar_url: ''
  })
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profiles/me')
        const data = res.data
        setFullName(data.full_name || '')
        setEmail(data.email || '')
        setForm({
          mobile: data.mobile || '',
          dob: data.dob ? data.dob.split('T')[0] : '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await api.post('/profiles/me', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <p className="text-xl font-bold text-white">Loading...</p>
      </div>
    )
  }

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="text-emerald-100 hover:text-white text-sm mb-6 inline-block"
        >
          ← Back
        </button>

        {/* Avatar + Name */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {form.avatar_url
              ? <img src={form.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
              : initials
            }
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
            <p className="text-slate-500 text-sm">{email}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-emerald-700 mb-6">Edit Profile</h2>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-slate-600">Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="e.g. 9876543210"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-600">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-600">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                placeholder="Tell students about yourself..."
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-600">Avatar URL</label>
              <input
                type="url"
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile