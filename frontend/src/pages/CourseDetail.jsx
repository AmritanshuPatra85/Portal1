import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [expandedModule, setExpandedModule] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courseRes, modulesRes, enrollRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/modules/${id}`),
          api.get(`/enrollments/check/${id}`),
        ])
        setCourse(courseRes.data?.data || courseRes.data)
        setModules(modulesRes.data?.data || modulesRes.data || [])
        setEnrolled(enrollRes.data?.enrolled || false)

        // Only fetch announcements if student is enrolled
        if (enrollRes.data?.enrolled) {
          try {
            const announceRes = await api.get(`/announcements/course/${id}`)
            setAnnouncements(announceRes.data?.data || announceRes.data || [])
          } catch (err) {
            setAnnouncements([])
          }
        }
      } catch (err) {
        console.error('CourseDetail fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      if (course.price > 0) {
        const res = await api.post('/payments/create-order', { course_id: id })
        const { order_id, amount, currency, key } = res.data

        console.log('Razorpay key:', key)

        const options = {
          key,
          amount,
          currency,
          order_id,
          name: 'EduVora',
          description: course.title,
          handler: async (response) => {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              course_id: id,
            })
            setEnrolled(true)
            navigate('/dashboard')
          },
          prefill: {
            email: localStorage.getItem('email') || '',
          },
          theme: { color: '#6ECA97' },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        await api.post(`/enrollments/free/${id}`)
        setEnrolled(true)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Enroll error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  const gradients = [
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] flex items-center justify-center">
        <div className="text-[#FFFFFF] text-xl animate-pulse">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] flex items-center justify-center">
        <div className="bg-[#FFFFFF]/80 rounded-2xl p-10 text-center">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-[#1E293B] font-semibold">Course not found</p>
          <Link to="/courses" className="text-[#5B8DEF] text-sm mt-3 inline-block hover:underline">
            ← Back to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">

      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold text-[#FFFFFF] tracking-wide drop-shadow-lg">EduVora</h1>
        <p className="text-[#EEF3FD] mt-2 text-lg">Course Details</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-12">

        {/* Back link */}
        <Link to="/courses" className="text-[#EEF3FD] text-sm hover:text-[#FFFFFF] mb-4 inline-block">
          ← Back to courses
        </Link>

        {/* Hero Card */}
        <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mb-6">

          {/* Banner */}
          <div className={`h-48 bg-gradient-to-br ${gradients[id % gradients.length]} flex items-center justify-center text-6xl`}>
            📚
          </div>

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-md mb-3 ${
                  course.price > 0
                    ? 'bg-[#EEF3FD] text-[#F9A852]'
                    : 'bg-[#EEF3FD] text-[#6ECA97]'
                }`}>
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </span>

                <h2 className="text-2xl font-bold text-[#1E293B] mb-2">{course.title}</h2>
                <p className="text-[#94A3B8] text-sm mb-1">
                  By {course.instructor_name || course.teacher_name || 'Instructor'}
                </p>
                {course.rating > 0 && (
                  <p className="text-[#F9A852] text-sm font-semibold">
                    ⭐ {Number(course.rating).toFixed(1)} rating
                  </p>
                )}
              </div>

              {/* Enroll Button */}
              <div className="sm:text-right">
                {enrolled ? (
                  <Link
                    to={`/courses/${id}/learn`}
                    className="inline-block px-8 py-3 rounded-xl bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] font-bold shadow-lg transition-all duration-300"
                  >
                    Continue Learning →
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="px-8 py-3 rounded-xl bg-[#5B8DEF] hover:bg-[#5B8DEF] disabled:opacity-60 text-[#FFFFFF] font-bold shadow-lg transition-all duration-300"
                  >
                    {enrolling ? 'Processing...' : course.price > 0 ? `Enroll for ₹${course.price}` : 'Enroll for Free'}
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-[#E8EDF2] pt-6">
              <h3 className="text-[#1E293B] font-semibold mb-2">About this course</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {course.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div>
          <h3 className="text-[#FFFFFF] font-semibold text-lg mb-3 tracking-wide">Curriculum</h3>

          {modules.length === 0 ? (
            <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl px-8 py-10 text-center">
              <p className="text-[#94A3B8] text-sm">No modules added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {modules.map((module, i) => (
                <div key={module.id || module.module_id || i} className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">

                  <button
                    onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#EEF3FD] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#EEF3FD] text-[#5B8DEF] text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-[#1E293B] font-semibold text-sm">{module.title}</span>
                    </div>
                    <span className="text-[#94A3B8] text-sm">
                      {expandedModule === i ? '▲' : '▼'}
                    </span>
                  </button>

                  {expandedModule === i && (
                    <div className="border-t border-[#E8EDF2] px-6 py-3 space-y-2">
                      {module.lectures?.length > 0 ? (
                        module.lectures.map((lecture, j) => (
                          <div key={lecture.id || lecture.lecture_id || j} className="flex items-center gap-3 py-2">
                            <span className="text-[#5B8DEF] text-sm">▶</span>
                            <span className="text-[#94A3B8] text-sm">{lecture.title}</span>
                            {!enrolled && (
                              <span className="ml-auto text-xs text-[#94A3B8]">🔒</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[#94A3B8] text-xs py-2">No lectures in this module.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {enrolled && announcements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-[#FFFFFF] font-semibold text-lg mb-3 tracking-wide">Announcements</h3>
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <div key={i} className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-xl px-6 py-4 shadow-lg">
                  <p className="text-[#1E293B] font-semibold text-sm">{a.title}</p>
                  <p className="text-[#94A3B8] text-sm mt-1">{a.message}</p>
                  <p className="text-[#94A3B8] text-xs mt-2">
                    {new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>


    </div>
  )
}

export default CourseDetail
