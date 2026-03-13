import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/students/getStudents"
      );
      const data = res.data.students || res.data || [];
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/students/deleteStudent/${id}`
      );
      alert("Student deleted successfully");
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting student");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
        <p className="text-xl font-bold text-white">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl w-full max-w-6xl p-10">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-emerald-700">Student List</h1>
            <p className="text-slate-500 mt-1">Manage all registered students</p>
          </div>
          <Link
            to="/add-student"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-300"
          >
            + Add Student
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white text-sm uppercase tracking-wide">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Date of Birth</th>
                <th className="p-4">Course</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-slate-700 text-sm">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-slate-500">
                    No students found. Add one!
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-emerald-50 transition">
                    <td className="p-4 font-medium">{student.id}</td>
                    <td className="p-4">{student.full_name}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">
                      {student.dob ? new Date(student.dob).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {student.course}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-3">
                      <button
                        onClick={() => navigate(`/edit-student/${student.id}`)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default StudentList;