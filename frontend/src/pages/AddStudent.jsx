import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api.js'

const AddStudent = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    dob: '',
    course: '',
    updated_by: 'admin'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/students/addStudents`, formData)
      alert('Student added successfully!')
      navigate('/students')
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex flex-col items-center py-14 px-4">

      {/* Page Title */}
      <div className="text-center mb-5">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Add Student
        </h1>
        <p className="text-emerald-100 mt-2 text-lg">
          Enter student details below
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <form className="space-y-6 text-slate-700" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block mb-2 font-semibold text-slate-600">Course</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="reset"
              onClick={() => setFormData({ full_name: '', email: '', dob: '', course: '', updated_by: 'admin' })}
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Reset
            </button>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Submit
            </button>
          </div>

        </form>
      </div>

      {/* Back Link */}
      <Link
        to="/students"
        className="mt-10 text-white font-medium hover:underline hover:text-emerald-200 transition"
      >
        ← View Student List
      </Link>

    </div>
  )
}

export default AddStudent
