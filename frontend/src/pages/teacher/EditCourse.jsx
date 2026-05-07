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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">
        <p className="text-xl font-bold text-[#FFFFFF]">Loading course...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] flex items-center justify-center py-14 px-4">
      <div className="w-full max-w-2xl bg-[#FFFFFF]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-[#5B8DEF] mb-2">Edit Course</h1>
        <p className="text-[#94A3B8] mb-6">Update your course details</p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{/* TODO: map this color */}
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-[#94A3B8]">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#94A3B8]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] transition resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-[#94A3B8]">Price (₹)</label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-[#E8EDF2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] transition"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E8EDF2] bg-[#FFFFFF] px-4 py-4">
            <div>
              <p className="font-semibold text-[#1E293B]">Publish Course</p>
              <p className="text-sm text-[#94A3B8]">Make visible to students</p>
            </div>
            <label className="inline-flex items-center gap-3 select-none">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published === 1}
                onChange={handleChange}
                className="h-5 w-5 accent-emerald-600"
              />
              <span className="text-sm font-semibold text-[#1E293B]">
                {form.is_published === 1 ? 'Published' : 'Draft'}
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-[#EEF3FD] hover:bg-[#E8EDF2] text-[#1E293B] px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
