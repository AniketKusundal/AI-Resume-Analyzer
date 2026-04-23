import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/resume/my-resumes");
      setResumes(res.data.data);
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 CALCULATIONS
  const total = resumes.length;

  const avg =
    total > 0
      ? Math.round(
          resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / total
        )
      : 0;

  const best =
    total > 0 ? Math.max(...resumes.map((r) => r.atsScore || 0)) : 0;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">Dashboard 🚀</h1>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <Card title="Total Resumes" value={total} />

            <Card title="Average Score" value={avg} />

            <Card title="Best Score" value={best} />
          </div>

          {/* RESUME LIST */}
          <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md border border-white/10">
            <h2 className="text-lg mb-4 font-semibold">Your Resumes</h2>

            {total === 0 ? (
              <p className="text-gray-400">🚫 No resumes uploaded yet</p>
            ) : (
              resumes.map((r) => (
                <div
                  key={r._id}
                  className="border-b border-gray-700 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">ATS Score: {r.atsScore}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <a
                     href={r.fileUrl}
  target="_blank"
  rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    View 📄
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

// 🔥 REUSABLE CARD COMPONENT
const Card = ({ title, value }) => (
  <div className="bg-white/10 p-5 rounded-xl backdrop-blur-md border border-white/10 hover:scale-105 transition">
    <h2 className="text-sm text-gray-400">{title}</h2>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);