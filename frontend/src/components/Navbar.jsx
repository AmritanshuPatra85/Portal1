import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-[#5B8DEF] shadow-lg px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-[#FFFFFF] text-xl font-bold tracking-wide">
        Learning Portal
      </Link>

      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="text-[#EEF3FD] hover:text-[#FFFFFF] font-medium transition"
        >
          Home
        </Link>

        {role === 'admin' && (
          <>
            <Link
              to="/students"
              className="text-[#EEF3FD] hover:text-[#FFFFFF] font-medium transition"
            >
              Students
            </Link>
            <Link
              to="/add-student"
              className="text-[#EEF3FD] hover:text-[#FFFFFF] font-medium transition"
            >
              Add Student
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-[#FFFFFF] text-[#5B8DEF] px-4 py-2 rounded-lg font-semibold hover:bg-[#EEF3FD] transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
