import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../utils/api.js"

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    is_published: 0
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => {
      const { title, description, price, is_published } = res.data
      setForm({ title, description, price, is_published: is_published ? 1 : 0 })
      setLoading(false)
    })
  }, [id])

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target.checked ? 1 : 0) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await api.put(`/courses/${id}`, form)
      navigate("/teacher")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <p className="text-xl font-bold text-white">Loading course...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-emerald-700 mb-2">Edit Course</h1>
        <p className="text-slate-500 mb-6">Update your course details</p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Price (₹)</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-4">
            <div>
              <p className="font-semibold text-slate-700">Publish Course</p>
              <p className="text-sm text-slate-500">Make visible to students</p>
            </div>
            <label className="inline-flex items-center gap-3 select-none">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published === 1}
                onChange={handleChange}
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm font-semibold text-slate-700">
                {form.is_published === 1 ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}