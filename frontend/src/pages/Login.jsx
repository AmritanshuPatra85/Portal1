import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/students');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-700">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700 mb-3"
        >
          Login
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
