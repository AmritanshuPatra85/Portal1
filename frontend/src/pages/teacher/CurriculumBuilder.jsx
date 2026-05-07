import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

const CurriculumBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingModule, setAddingModule] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: '', message: '' });
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  // Per-module lecture form state
  const [lectureForm, setLectureForm] = useState({});
  const [uploadingLecture, setUploadingLecture] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const modulesRes = await api.get(`/modules/${id}`);
        const rawModules = modulesRes.data?.data || modulesRes.data || [];

        const modulesWithLectures = await Promise.all(
          rawModules.map(async (module) => {
            const lecturesRes = await api.get(
              `/modules/lectures/${module.id}`
            );

            return {
              ...module,
              lectures: lecturesRes.data?.data || lecturesRes.data || [],
            };
          })
        );

        setModules(modulesWithLectures);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAll();
    }
  }, [id]);

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;

    setAddingModule(true);

    try {
      const res = await api.post('/modules', {
        course_id: id,
        title: newModuleTitle,
        order_index: modules.length + 1,
      });

      const newModule = res.data?.data || res.data;

      setModules([
        ...modules,
        {
          ...newModule,
          lectures: [],
        },
      ]);

      setNewModuleTitle('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add module');
    } finally {
      setAddingModule(false);
    }
  };

  const handleLectureFormChange = (moduleId, field, value) => {
    setLectureForm((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  };

  const postAnnouncement = async () => {
    if (!announcement.title.trim() || !announcement.message.trim()) {
      alert('Please provide both title and message');
      return;
    }
    setPostingAnnouncement(true);
    try {
      await api.post('/announcements', {
        title: announcement.title,
        message: announcement.message,
        target: 'course',
        course_id: id,
      });
      setAnnouncement({ title: '', message: '' });
      alert('Announcement posted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  const addLecture = async (moduleId, moduleLecturesCount) => {
    const form = lectureForm[moduleId] || {};

    if (!form.title?.trim() || !form.videoFile) {
      alert('Please provide a lecture title and video file');
      return;
    }

    setUploadingLecture((prev) => ({
      ...prev,
      [moduleId]: true,
    }));

    try {
      // Step 1 — create lecture record
      const lectureRes = await api.post('/modules/lectures', {
        module_id: moduleId,
        title: form.title,
        order_index: moduleLecturesCount + 1,
        is_free: form.is_free ? 1 : 0,
      });

      const newLecture = lectureRes.data?.data || lectureRes.data;

      // Step 2 — upload video
      const formData = new FormData();
      formData.append('video', form.videoFile);
      formData.append('lecture_id', newLecture.id);

      await api.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local state
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lectures: [...m.lectures, newLecture],
              }
            : m
        )
      );

      // Clear lecture form for this module
      setLectureForm((prev) => ({
        ...prev,
        [moduleId]: {},
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lecture');
    } finally {
      setUploadingLecture((prev) => ({
        ...prev,
        [moduleId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] flex items-center justify-center">
        <p className="text-[#FFFFFF] text-xl animate-pulse">
          Loading curriculum...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#FFFFFF]">
              Curriculum Builder
            </h1>
            <p className="text-[#EEF3FD] mt-1">
              Add modules and lectures to your course
            </p>
          </div>

          <button
            onClick={() => navigate('/teacher')}
            className="text-[#EEF3FD] hover:text-[#FFFFFF] text-sm"
          >
            ← Back to dashboard
          </button>
        </div>

        {/* Add Module */}
        <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl px-6 py-5 mb-6">
          <h2 className="text-[#1E293B] font-semibold mb-3">
            Add New Module
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Module title e.g. Getting Started"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              className="flex-1 border border-[#E8EDF2] rounded-xl px-4 py-2 text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
            />

            <button
              onClick={addModule}
              disabled={addingModule}
              className="bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-5 py-2 rounded-xl font-semibold disabled:opacity-60 transition"
            >
              {addingModule ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </div>

        {/* Modules List */}
        {modules.length === 0 ? (
          <div className="bg-[#FFFFFF]/80 rounded-2xl px-8 py-12 text-center">
            <p className="text-[#94A3B8]">
              No modules yet. Add your first module above.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {modules.map((module, mi) => (
              <div
                key={module.id}
                className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
              >
                {/* Module Header */}
                <div className="px-6 py-4 bg-[#EEF3FD] border-b border-[#E8EDF2] flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#5B8DEF] text-[#FFFFFF] text-xs font-bold flex items-center justify-center">
                    {mi + 1}
                  </span>

                  <h3 className="text-[#1E293B] font-semibold">
                    {module.title}
                  </h3>

                  <span className="ml-auto text-xs text-[#94A3B8]">
                    {module.lectures.length} lectures
                  </span>
                </div>

                {/* Existing Lectures */}
                <div className="px-6 py-3 space-y-2">
                  {module.lectures.map((lecture) => (
                    <div
                      key={lecture.id}
                      className="flex items-center gap-3 py-2 border-b border-[#E8EDF2]"
                    >
                      <span className="text-[#5B8DEF] text-sm">▶</span>

                      <span className="text-[#1E293B] text-sm">
                        {lecture.title}
                      </span>

                      {lecture.video_url ? (
                        <span className="ml-auto text-xs text-[#5B8DEF]">
                          ✓ Video uploaded
                        </span>
                      ) : (
                        <span className="ml-auto text-xs text-[#F9A852]">
                          No video
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Lecture Form */}
                <div className="px-6 py-4 bg-[#F0F4F8] border-t border-[#E8EDF2] space-y-3">
                  <p className="text-sm font-semibold text-[#94A3B8]">
                    Add Lecture
                  </p>

                  <input
                    type="text"
                    placeholder="Lecture title"
                    value={lectureForm[module.id]?.title || ''}
                    onChange={(e) =>
                      handleLectureFormChange(
                        module.id,
                        'title',
                        e.target.value
                      )
                    }
                    className="w-full border border-[#E8EDF2] rounded-xl px-4 py-2 text-[#1E293B] text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
                  />

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      handleLectureFormChange(
                        module.id,
                        'videoFile',
                        e.target.files[0]
                      )
                    }
                    className="w-full text-sm text-[#94A3B8]"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`free-${module.id}`}
                      checked={lectureForm[module.id]?.is_free || false}
                      onChange={(e) =>
                        handleLectureFormChange(
                          module.id,
                          'is_free',
                          e.target.checked
                        )
                      }
                      className="accent-emerald-600"
                    />

                    <label
                      htmlFor={`free-${module.id}`}
                      className="text-sm text-[#94A3B8]"
                    >
                      Free preview
                    </label>
                  </div>

                  <button
                    onClick={() =>
                      addLecture(module.id, module.lectures.length)
                    }
                    disabled={uploadingLecture[module.id]}
                    className="bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 transition"
                  >
                    {uploadingLecture[module.id]
                      ? 'Uploading...'
                      : '+ Add Lecture'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-xl px-6 py-5 mt-6">
          <h2 className="text-[#1E293B] font-semibold mb-3">Post Announcement</h2>
          <input
            type="text"
            placeholder="Announcement title"
            value={announcement.title}
            onChange={(e) =>
              setAnnouncement({ ...announcement, title: e.target.value })
            }
            className="w-full border border-[#E8EDF2] rounded-xl px-4 py-2 text-[#1E293B] mb-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF]"
          />
          <textarea
            placeholder="Write your announcement..."
            value={announcement.message}
            onChange={(e) =>
              setAnnouncement({ ...announcement, message: e.target.value })
            }
            rows={3}
            className="w-full border border-[#E8EDF2] rounded-xl px-4 py-2 text-[#1E293B] mb-3 focus:outline-none focus:ring-2 focus:ring-[#5B8DEF] resize-none"
          />
          <button
            onClick={postAnnouncement}
            disabled={postingAnnouncement}
            className="bg-[#5B8DEF] hover:bg-[#5B8DEF] text-[#FFFFFF] px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-60 transition"
          >
            {postingAnnouncement ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurriculumBuilder;
