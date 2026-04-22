import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 shadow-lg px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-white text-xl font-bold tracking-wide">
        Learning Portal
      </Link>

      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="text-emerald-100 hover:text-white font-medium transition"
        >
          Home
        </Link>
        <Link
          to="/students"
          className="text-emerald-100 hover:text-white font-medium transition"
        >
          Students
        </Link>
        <Link
          to="/add-student"
          className="text-emerald-100 hover:text-white font-medium transition"
        >
          Add Student
        </Link>
        <button
          onClick={handleLogout}
          className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;