import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'

const CoursePlayer = () => {
  const { id } = useParams()

  const [modules, setModules] = useState([])
  const [currentLecture, setCurrentLecture] = useState(null)
  const [progress, setProgress] = useState({})
  const [videoUrl, setVideoUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  const videoRef = useRef(null)
  const progressInterval = useRef(null)

  const loadVideo = async (lecture) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `http://localhost:3000/api/upload/video/${lecture.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
    } catch (err) {
      console.error('Video load error:', err)
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const modulesRes = await api.get(`/modules/${id}`)
        const rawModules = modulesRes.data?.data || modulesRes.data || []

        const modulesWithLectures = await Promise.all(
          rawModules.map(async (module) => {
            const lecturesRes = await api.get(`/modules/lectures/${module.id}`)
            return {
              ...module,
              lectures: lecturesRes.data?.data || lecturesRes.data || [],
            }
          })
        )

        const progressRes = await api.get(`/progress/course/${id}`)
        const rawProgress = progressRes.data?.data || progressRes.data || []
        const progressMap = rawProgress.reduce((acc, p) => {
          acc[p.lecture_id] = {
            watched_seconds: p.watched_seconds || 0,
            is_completed: !!p.is_completed,
          }
          return acc
        }, {})

        setModules(modulesWithLectures)
        setProgress(progressMap)

        const firstLecture = modulesWithLectures?.[0]?.lectures?.[0] || null
        setCurrentLecture(firstLecture)
      } catch (err) {
        console.error('CoursePlayer fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  useEffect(() => {
    if (currentLecture) loadVideo(currentLecture)
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl)
    }
  }, [currentLecture])

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        progressInterval.current = null
      }
    }
  }, [])

  const lectureIndexInfo = useMemo(() => {
    if (!currentLecture) return { number: 0, total: 0 }
    const allLectures = modules.flatMap(m => m.lectures || [])
    const idx = allLectures.findIndex(l => (l.id || l.lecture_id) === (currentLecture.id || currentLecture.lecture_id))
    return { number: idx >= 0 ? idx + 1 : 0, total: allLectures.length }
  }, [modules, currentLecture])

  const sendProgress = async () => {
    if (!videoRef.current || !currentLecture) return

    const currentTime = videoRef.current.currentTime || 0
    const duration = videoRef.current.duration || 0

    try {
      await api.post('/progress', {
        lecture_id: currentLecture.id,
        watched_seconds: Math.floor(currentTime),
        total_seconds: Math.floor(duration),
      })

      const watched_seconds = Math.floor(currentTime)
      const total_seconds = Math.floor(duration)
      const is_completed = total_seconds > 0 ? watched_seconds >= total_seconds : false

      setProgress(prev => ({
        ...prev,
        [currentLecture.id]: { watched_seconds, is_completed },
      }))
    } catch (err) {
      console.error('Progress update error:', err)
    }
  }

  const startProgressInterval = () => {
    if (progressInterval.current) return
    progressInterval.current = setInterval(() => {
      sendProgress()
    }, 10000)
  }

  const stopProgressInterval = async () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    await sendProgress()
  }

  const token = localStorage.getItem('token') || ''
  const videoSrc = currentLecture
    ? `http://localhost:3000/api/modules/lectures/${currentLecture.id}/stream?token=${encodeURIComponent(token)}`
    : ''

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">
        <p className="text-[#FFFFFF] text-xl font-bold">Loading course player...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-[#FFFFFF] tracking-wide drop-shadow-lg">EduVora</h1>
        <p className="text-[#EEF3FD] mt-1 text-base">Course Player</p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-10">
        <Link to={`/courses/${id}`} className="text-[#EEF3FD] text-sm hover:text-[#FFFFFF] mb-4 inline-block">
          ← Back to course
        </Link>

        <div className="flex gap-4">
          {/* Left (Video) */}
          <div className="w-[70%]">
            <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
              {currentLecture ? (
                <>
                  <video
                    key={currentLecture?.id}
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    className="w-full rounded-xl"
                    onPlay={startProgressInterval}
                    onPause={stopProgressInterval}
                    onEnded={stopProgressInterval}
                  />
                  <div className="p-6">
                    <p className="text-[#5B8DEF] text-xs font-semibold uppercase tracking-wide">
                      Lecture {lectureIndexInfo.number}{lectureIndexInfo.total ? ` of ${lectureIndexInfo.total}` : ''}
                    </p>
                    <h2 className="text-[#1E293B] font-bold text-lg mt-1">
                      {currentLecture.title || 'Untitled Lecture'}
                    </h2>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-[#94A3B8]">No lectures available for this course yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right (Curriculum) */}
          <aside className="w-[30%]">
            <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E8EDF2]">
                <h3 className="text-[#1E293B] font-bold">Curriculum</h3>
                <p className="text-[#94A3B8] text-xs mt-1">Select a lecture to play</p>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-4 py-4 space-y-4">
                {modules.length === 0 ? (
                  <p className="text-[#94A3B8] text-sm px-2">No modules added yet.</p>
                ) : (
                  modules.map((module, mi) => (
                    <div key={module.id || mi}>
                      <p className="text-[#5B8DEF] font-semibold text-sm px-2 mb-2">
                        {module.title || `Module ${mi + 1}`}
                      </p>

                      <div className="space-y-2">
                        {(module.lectures || []).map((lecture, li) => {
                          const lectureId = lecture.id || lecture.lecture_id
                          const isCurrent = currentLecture?.id === lectureId
                          const isCompleted = progress?.[lectureId]?.is_completed
                          return (
                            <button
                              key={lectureId || li}
                              onClick={() => setCurrentLecture({ ...lecture, id: lectureId })}
                              className={[
                                'w-full text-left px-3 py-2 rounded-xl transition-colors duration-150 flex items-start gap-2',
                                isCurrent ? 'bg-[#EEF3FD]' : 'hover:bg-[#EEF3FD]',
                              ].join(' ')}
                            >
                              <span className="mt-0.5 text-xs font-bold text-[#5B8DEF]">
                                {mi + 1}.{li + 1}
                              </span>
                              <span className="flex-1 text-[#1E293B] text-sm leading-snug">
                                {lecture.title || 'Untitled Lecture'}
                              </span>
                              {isCompleted && (
                                <span className="text-[#5B8DEF] text-sm font-bold" aria-label="Completed">
                                  ✓
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#5B8DEF] text-[#FFFFFF] text-center py-4 text-sm tracking-wide">
        Happy Learning 🚀
      </footer>
    </div>
  )
}

export default CoursePlayer
