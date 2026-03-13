import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const EditStudent = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    dob: '',
    course: '',
    updated_by: 'admin'
  })

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/students/getStudent/${id}`)
        const student = response.data
        setFormData({
          full_name: student.full_name,
          email: student.email,
          dob: student.dob.split('T')[0],
          course: student.course,
          updated_by: 'admin'
        })
      } catch (error) {
        alert('Error fetching student: ' + error.message)
      }
    }
    fetchStudent()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:3000/api/students/editStudent/${id}`, formData)
      alert('Student updated successfully!')
      navigate('/students')
    } catch (error) {
      alert('Error updating student: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex flex-col items-center py-14 px-4">
      <div className="text-center mb-5">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">Edit Student</h1>
        <p className="text-emerald-100 mt-2 text-lg">Update student details below</p>
      </div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10">
        <form className="space-y-6 text-slate-700" onSubmit={handleSubmit}>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-slate-600">Course</label>
            <input type="text" name="course" value={formData.course}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
          </div>

          <div className="flex justify-between pt-4">
            <Link to="/students"
              className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300">
              Cancel
            </Link>
            <button type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300">
              Update
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditStudent