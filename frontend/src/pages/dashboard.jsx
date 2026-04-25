import { useState, useEffect } from 'react';
import api from '../utils/api.js';

const Dashboard = () => {
  const [auth, setAuth] = useState({ email: '', role: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    dob: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const decodeToken = (token) => {
      try {
        const payload = token.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(
          normalized.length + ((4 - (normalized.length % 4)) % 4),
          '='
        );
        const json = atob(padded);
        return JSON.parse(json);
      } catch {
        return null;
      }
    };

    const fetchMyProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = token ? decodeToken(token) : null;
        setAuth({ email: decoded?.email || '', role: decoded?.role || '' });

        const res = await api.get('/api/profiles/me');
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/api/profiles/me', formData);
      setProfile(res.data);
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
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
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
            name="bio"
            placeholder="Bio"
            value={formData.bio}
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
        <p className="text-slate-500 text-center mb-6">Your profile</p>

        <div className="bg-emerald-50 rounded-xl p-6 space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Email</span>
            <span className="text-slate-800 font-semibold">{auth.email || '-'}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Role</span>
            <span className="text-slate-800 font-semibold">{auth.role || '-'}</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-slate-500 font-medium">Mobile</span>
            <span className="text-slate-800 font-semibold">{profile?.mobile || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Date of Birth</span>
            <span className="text-slate-800 font-semibold">
              {profile?.dob ? new Date(profile.dob).toLocaleDateString() : '-'}
            </span>
          </div>
          <div className="border-t pt-3">
            <span className="text-slate-500 font-medium block mb-1">Bio</span>
            <span className="text-slate-800 font-semibold block break-words">
              {profile?.bio || '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
