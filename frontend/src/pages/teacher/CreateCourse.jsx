import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api.js'

const CreateCourse = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail_url: '',
    is_published: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'price') {
      setForm({ ...form, [name]: value === '' ? '' : Number(value) })
      return
    }

    if (name === 'is_published') {
      setForm({ ...form, [name]: type === 'checkbox' ? (checked ? 1 : 0) : Number(value) })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post(`/courses`, form)
      navigate('/teacher')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-emerald-700">Create Course</h1>
          <p className="text-slate-500 mt-1">Add a new course to your catalog</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5 text-slate-700" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              placeholder="e.g. Complete React Mastery"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none"
              placeholder="What will students learn in this course?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-semibold text-slate-600">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-slate-600">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail_url"
                value={form.thumbnail_url}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4">
            <div>
              <p className="font-semibold text-slate-700">Publish Now</p>
              <p className="text-sm text-slate-500">Make this course visible to students</p>
            </div>
            <label className="inline-flex items-center gap-3 select-none">
              <input
                type="checkbox"
                name="is_published"
                checked={Number(form.is_published) === 1}
                onChange={handleChange}
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm font-semibold text-slate-700">
                {Number(form.is_published) === 1 ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse

