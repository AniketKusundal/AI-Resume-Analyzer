import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Award,
  TrendingUp,
  UploadCloud,
  ExternalLink,
  Plus,
  BarChart3,
  Calendar,
  Sparkles,
  Download
} from "lucide-react";

const getPdfViewerUrl = (url) => {
  if (!url) return "#";
  if (url.includes("cloudinary.com")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | ResuMatch AI";
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/resume/my-resumes");
      setResumes(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard <Sparkles className="text-emerald-600" size={24} />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your uploaded resumes, ATS scores, and AI recommendations
          </p>
        </div>

        <Link
          to="/upload"
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white text-sm font-semibold rounded-xl shadow-md hover:scale-105 transition flex items-center gap-2"
        >
          <Plus size={18} /> Upload New Resume
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 gap-3">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading your resume analytics...</span>
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Total Resumes Analyzed"
              value={total}
              icon={<FileText className="text-emerald-600" size={22} />}
              badge="Active Documents"
            />
            <StatCard
              title="Average ATS Score"
              value={avg > 0 ? `${avg}/100` : "N/A"}
              icon={<BarChart3 className="text-lime-600" size={22} />}
              badge="Overall Health"
            />
            <StatCard
              title="Best ATS Score"
              value={best > 0 ? `${best}/100` : "N/A"}
              icon={<Award className="text-teal-600" size={22} />}
              badge="Peak Performance"
            />
          </div>

          {/* RESUMES LIST TABLE / CARDS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" /> Date-Wise Resume History
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {total} {total === 1 ? "document" : "documents"} found
              </span>
            </div>

            {total === 0 ? (
              <div className="text-center py-16 space-y-4 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-base">No resumes uploaded yet</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Upload your first PDF resume to generate a detailed ATS analysis & score
                  </p>
                </div>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition shadow-md"
                >
                  Upload Resume Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((r) => {
                  const uploadDate = new Date(r.createdAt || Date.now());
                  const formattedDate = uploadDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const formattedTime = uploadDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={r._id}
                      className="bg-slate-50 border border-slate-200 hover:border-emerald-300 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition shadow-sm"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                            <Calendar size={13} className="text-emerald-600" /> Uploaded on {formattedDate} at {formattedTime}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            ATS Score:
                          </span>
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                              (r.atsScore || 0) >= 75
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {r.atsScore || 0} / 100
                          </span>
                        </div>
                        
                        {r.aiFeedback?.summary && (
                          <p className="text-xs text-slate-600 line-clamp-1 max-w-xl pt-1">
                            "{r.aiFeedback.summary}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={getPdfViewerUrl(r.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                        >
                          View PDF <ExternalLink size={14} />
                        </a>
                        <a
                          href={r.fileUrl}
                          target="_blank"
                          download
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                        >
                          Download <Download size={14} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

const StatCard = ({ title, value, icon, badge }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
        {icon}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
        {badge}
      </span>
    </div>
    <p className="text-xs font-medium text-slate-500">{title}</p>
    <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);