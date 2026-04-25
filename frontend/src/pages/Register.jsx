import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api.js';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post('/api/auth/register', formData);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-700">Create Account</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 mb-3"
        >
          Register
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
