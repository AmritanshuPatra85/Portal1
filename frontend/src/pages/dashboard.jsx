import { useState, useEffect } from 'react';
import api from '../utils/api.js';

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    course: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await api.get('/api/students/me');
        setStudent(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/api/students/me', formData);
      setStudent(res.data);
      setNotFound(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <p className="text-white text-xl font-bold">Loading your profile...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full">
          <h1 className="text-2xl font-bold text-emerald-700 mb-2 text-center">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-center mb-6">
            Fill in your details to get started
          </p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />
          <input
            type="text"
            name="course"
            placeholder="Course (e.g. CSE, MBA)"
            value={formData.course}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            onClick={handleCompleteProfile}
            disabled={saving}
            className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2 text-center">
          My Dashboard
        </h1>
        <p className="text-slate-500 text-center mb-6">Your student profile</p>

        <div className="bg-emerald-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Full Name</span>
            <span className="text-slate-800 font-semibold">{student.full_name}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Email</span>
            <span className="text-slate-800 font-semibold">{student.email}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Course</span>
            <span className="text-slate-800 font-semibold">{student.course}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Date of Birth</span>
            <span className="text-slate-800 font-semibold">
              {student.dob ? new Date(student.dob).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;