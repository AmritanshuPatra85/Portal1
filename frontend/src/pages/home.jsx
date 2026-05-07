import { Link } from 'react-router-dom'

const Home = () => {
  const role = localStorage.getItem('role');

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#EEF3FD] via-[#5B8DEF] to-[#A78BFA] text-[#1E293B]">

        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-[#FFFFFF] tracking-wide drop-shadow-lg">
            Learning Portal
          </h1>
          <p className="text-[#EEF3FD] mt-2 text-lg">
            Manage students easily and efficiently
          </p>
        </header>

        {/* Navigation — admin only */}
        {role === 'admin' && (
          <nav className="flex justify-center">
            <div className="bg-[#FFFFFF]/20 backdrop-blur-md rounded-xl shadow-lg px-10 py-4">
              <ul className="flex gap-10 text-lg font-semibold text-[#FFFFFF]">
                <li>
                  <Link to="/add-student"
                    className="px-6 py-2 rounded-lg bg-[#5B8DEF] hover:bg-[#5B8DEF] transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    Add Students
                  </Link>
                </li>
                <li>
                  <Link to="/students"
                    className="px-6 py-2 rounded-lg bg-[#1E293B] hover:bg-[#1E293B] transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    Students List
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-[#FFFFFF]/80 backdrop-blur-lg rounded-2xl shadow-2xl px-12 py-10 text-center max-w-lg">
            {role === 'admin' ? (
              <>
                <h2 className="text-2xl font-bold text-[#5B8DEF] mb-3">
                  Welcome, Admin 👋
                </h2>
                <p className="text-[#94A3B8] text-lg">
                  Select an option above to begin managing student records.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#5B8DEF] mb-3">
                  Welcome 👋
                </h2>
                <p className="text-[#94A3B8] text-lg">
                  Head to your <Link to="/dashboard" className="text-[#5B8DEF] font-semibold hover:underline">dashboard</Link> to view your profile.
                </p>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#5B8DEF] text-[#FFFFFF] text-center py-4 text-sm tracking-wide">
          © 2026 Learning Portal • Happy Learning 🚀
        </footer>

      </div>
    </>
  );
};

export default Home;
