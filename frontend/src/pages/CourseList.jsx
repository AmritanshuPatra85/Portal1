import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | free | paid

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses')
        setCourses(res.data?.data || res.data || [])
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filtered = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' ||
      (filter === 'free' && (course.price === 0 || course.price === '0' || !course.price)) ||
      (filter === 'paid' && course.price > 0)
    return matchesSearch && matchesFilter
  })

  const gradients = [
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
    'from-[#EEF3FD] to-[#A78BFA]',
  ]
  const icons = ['📚', '💻', '🎨', '🔬', '📊', '🎯', '🧠', '⚙️']

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">

      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold text-[#FFFFFF] tracking-wide drop-shadow-lg">EduVora</h1>
        <p className="text-[#EEF3FD] mt-2 text-lg">Explore our courses</p>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">

        {/* Search + Filter Bar */}
        <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl px-6 py-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-[#E8EDF2] rounded-lg px-4 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
          />
          <div className="flex gap-2">
            {['all', 'free', 'paid'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-all duration-200 ${
                  filter === f
                    ? 'bg-[#5B8DEF] text-[#FFFFFF] shadow-md'
                    : 'bg-[#FFFFFF] text-[#94A3B8] border border-[#E8EDF2] hover:bg-[#EEF3FD]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-[#EEF3FD] text-sm mb-4">
            {filtered.length} {filtered.length === 1 ? 'course' : 'courses'} found
          </p>
        )}

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#FFFFFF]/80 rounded-2xl shadow-xl overflow-hidden animate-pulse">
                <div className="h-36 bg-[#EEF3FD]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[#EEF3FD] rounded w-3/4" />
                  <div className="h-3 bg-[#EEF3FD] rounded w-1/2" />
                  <div className="h-3 bg-[#EEF3FD] rounded w-full" />
                  <div className="h-8 bg-[#EEF3FD] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[#94A3B8] text-lg font-semibold">No courses found</p>
            <p className="text-[#94A3B8] text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course, i) => (
              <Link
                to={`/courses/${course.id || course.course_id}`}
                key={course.id || course.course_id || i}
                className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className={`h-36 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-4xl`}>
                  {icons[i % icons.length]}
                </div>

                {/* Body */}
                <div className="p-5">
                  {/* Price badge */}
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-md mb-2 ${
                    course.price > 0
                      ? 'bg-[#EEF3FD] text-[#F9A852]'
                      : 'bg-[#EEF3FD] text-[#6ECA97]'
                  }`}>
                    {course.price > 0 ? `₹${course.price}` : 'Free'}
                  </span>

                  <h3 className="text-[#1E293B] font-semibold text-base leading-snug mb-1">
                    {course.title}
                  </h3>

                  <p className="text-[#94A3B8] text-xs mb-3 line-clamp-2">
                    {course.description || 'No description available.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[#94A3B8] text-xs">
                      By {course.instructor_name || course.teacher_name || 'Instructor'}
                    </p>
                    {course.rating > 0 && (
                      <span className="text-xs text-[#F9A852] font-semibold">
                        ⭐ {Number(course.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

    </div>
  )
}

export default CourseList
