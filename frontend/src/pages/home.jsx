import { Link } from 'react-router-dom'
const Home = () => {
  return (
    <>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-slate-800">

        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-lg">
            Learning Portal
          </h1>
          <p className="text-emerald-100 mt-2 text-lg">
            Manage students easily and efficiently
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-lg px-10 py-4">
            <ul className="flex gap-10 text-lg font-semibold text-white">

              <li>
                <Link to="/add-student"
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Add Students
                </Link>
              </li>

              <li>
                <Link to="/students"
                  className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  Students List
                </Link>
              </li>

            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl px-12 py-10 text-center max-w-lg">
            <h2 className="text-2xl font-bold text-emerald-700 mb-3">
              Welcome 👋
            </h2>
            <p className="text-slate-600 text-lg">
              Select an option above to begin managing student records.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-emerald-700 text-white text-center py-4 text-sm tracking-wide">
          © 2026 Learning Portal • Happy Learning 🚀
        </footer>

      </div>
    </>
  );
};

export default Home;