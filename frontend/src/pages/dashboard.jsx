import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // Decode token to get email (without a library)
  const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Student Dashboard</h1>
        <p className="text-slate-500 mb-6">Welcome back!</p>

        <div className="bg-emerald-50 rounded-xl p-6 text-left space-y-3">
          <p className="text-slate-700">
            <span className="font-semibold">Email:</span> {payload.email}
          </p>
          <p className="text-slate-700">
            <span className="font-semibold">Role:</span> {role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;