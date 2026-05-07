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
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-2xl bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-[#5B8DEF]">Create Course</h1>
          <p className="text-[#94A3B8] mt-1">Add a new course to your catalog</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{/* TODO: map this color */}
            {error}
          </div>
        )}

        <form className="space-y-5 text-[#1E293B]" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-semibold text-[#94A3B8]">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-[#5B8DEF] transition"
              placeholder="e.g. Complete React Mastery"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#94A3B8]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-[#5B8DEF] transition resize-none"
              placeholder="What will students learn in this course?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-semibold text-[#94A3B8]">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-[#5B8DEF] transition"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-[#94A3B8]">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail_url"
                value={form.thumbnail_url}
                onChange={handleChange}
                className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] focus:border-[#5B8DEF] transition"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E8EDF2] bg-[#FFFFFF] px-4 py-4">
            <div>
              <p className="font-semibold text-[#1E293B]">Publish Now</p>
              <p className="text-sm text-[#94A3B8]">Make this course visible to students</p>
            </div>
            <label className="inline-flex items-center gap-3 select-none">
              <input
                type="checkbox"
                name="is_published"
                checked={Number(form.is_published) === 1}
                onChange={handleChange}
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm font-semibold text-[#1E293B]">
                {Number(form.is_published) === 1 ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-[#EEF3FD] hover:bg-[#E8EDF2] text-[#1E293B] px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-70"
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
