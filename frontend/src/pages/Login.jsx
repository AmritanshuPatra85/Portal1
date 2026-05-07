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
      const res = await api.post('/auth/login', { email, password });
      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'teacher') {
        navigate('/teacher')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA]">
      <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#5B8DEF]">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm mb-4">{/* TODO: map this color */}{error}</p>}

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
          className="w-full bg-[#5B8DEF] text-[#FFFFFF] p-2 rounded hover:bg-[#5B8DEF] mb-3"
        >
          Login
        </button>

        <p className="text-center text-sm text-[#94A3B8]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#5B8DEF] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
