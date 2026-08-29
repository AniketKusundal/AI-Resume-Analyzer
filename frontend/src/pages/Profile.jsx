import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  FileText,
  Briefcase,
  Award,
  ExternalLink,
  Plus,
  BarChart3,
  Sparkles,
  PieChart,
  Edit3,
  Save,
  X,
  Globe,
  Code2,
  Share2,
  Key,
  Download,
  CheckCircle2
} from "lucide-react";

const getPdfViewerUrl = (url) => {
  if (!url) return "#";
  if (url.includes("cloudinary.com")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Mode State
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    target_role: "",
    bio: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  useEffect(() => {
    document.title = "Profile Analytics & Career Hub | ResuMatch AI";
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      const [userRes, resumesRes, jobsRes] = await Promise.allSettled([
        API.get("/user/profile"),
        API.get("/resume/my-resumes"),
        API.get("/job"),
      ]);

      if (userRes.status === "fulfilled" && userRes.value.data.user) {
        const u = userRes.value.data.user;
        setUser(u);
        setProfileForm({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          target_role: u.target_role || "",
          bio: u.bio || "",
          linkedin: u.linkedin || "",
          github: u.github || "",
          portfolio: u.portfolio || "",
        });
      }

      if (resumesRes.status === "fulfilled") {
        setResumes(resumesRes.value.data.data || []);
      }

      if (jobsRes.status === "fulfilled") {
        setJobs(jobsRes.value.data.jobs || jobsRes.value.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load profile analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await API.put("/user/profile", profileForm);
      setUser(res.data.user);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Resumes Analytics
  const totalResumes = resumes.length;
  const avgAtsScore =
    totalResumes > 0
      ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / totalResumes)
      : 0;

  // Aggregate extracted skills
  const allSkills = Array.from(
    new Set(
      resumes.flatMap((r) => r.aiFeedback?.skills?.technical || [])
    )
  );

  // Job Tracker Pipeline Analytics
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter((j) => (j.apply_status || j.status) === "Applied").length;
  const interviewCount = jobs.filter((j) => (j.apply_status || j.status) === "Interview").length;
  const pendingCount = jobs.filter((j) => (j.apply_status || j.status) === "Pending").length;
  const rejectedCount = jobs.filter((j) => (j.apply_status || j.status) === "Rejected").length;

  const interviewRate = totalJobs > 0 ? Math.round((interviewCount / totalJobs) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-lime-500 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <User size={32} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user ? `${user.first_name} ${user.last_name}` : "Career Analytics Hub"}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-emerald-150 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={13} className="text-emerald-600" /> Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Mail size={13} className="text-emerald-600" /> {user?.email}
                </span>
                {user?.target_role && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {user.target_role}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-2 shadow-sm"
            >
              {editing ? <X size={15} /> : <Edit3 size={15} />}
              <span>{editing ? "Cancel Editing" : "Edit Profile"}</span>
            </button>
            <Link
              to="/upload"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition flex items-center gap-1.5"
            >
              <Plus size={15} /> New Audit
            </Link>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        {editing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Job Role / Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer / AI Specialist"
                value={profileForm.target_role}
                onChange={(e) => setProfileForm({ ...profileForm, target_role: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Professional Bio / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Short professional summary..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 resize-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profileForm.linkedin}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profileForm.github}
                  onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.dev"
                  value={profileForm.portfolio}
                  onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              {saving ? "Saving..." : <><Save size={15} /> Save Profile Details</>}
            </button>
          </form>
        ) : (
          /* READ PROFILE DETAILS DISPLAY */
          <div className="space-y-4">
            {user?.bio && (
              <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                "{user.bio}"
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-xs">
              {user?.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition shadow-sm font-semibold"
                >
                  <Share2 size={14} className="text-emerald-600" /> LinkedIn Profile
                </a>
              )}

              {user?.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-sm font-semibold"
                >
                  <Code2 size={14} className="text-slate-700" /> GitHub Profile
                </a>
              )}

              {user?.portfolio && (
                <a
                  href={user.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3.5 py-1.5 rounded-xl border border-teal-200 transition shadow-sm font-semibold"
                >
                  <Globe size={14} className="text-teal-600" /> Portfolio Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Resumes Uploaded"
          value={totalResumes}
          icon={<FileText className="text-emerald-600" size={20} />}
          badge="Document Vault"
          gradient="from-emerald-500/10 to-emerald-50 border-emerald-200 text-emerald-800"
        />
        <StatCard
          title="Average ATS Score"
          value={avgAtsScore > 0 ? `${avgAtsScore}/100` : "N/A"}
          icon={<BarChart3 className="text-lime-600" size={20} />}
          badge="Score Meter"
          gradient="from-lime-500/10 to-lime-50 border-lime-200 text-lime-800"
        />
        <StatCard
          title="Applications Tracked"
          value={totalJobs}
          icon={<Briefcase className="text-teal-600" size={20} />}
          badge="Job Pipeline"
          gradient="from-teal-500/10 to-teal-50 border-teal-200 text-teal-800"
        />
        <StatCard
          title="Interview Conversion"
          value={`${interviewRate}%`}
          icon={<Award className="text-amber-600" size={20} />}
          badge="Interview Rate"
          gradient="from-amber-500/10 to-amber-50 border-amber-200 text-amber-800"
        />
      </div>

      {/* JOB APPLICATION PIPELINE BREAKDOWN CARDS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="text-emerald-600" size={22} /> Job Application Pipeline Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking across active job applications</p>
          </div>

          <Link to="/jobs" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition">
            Open Kanban Board <ExternalLink size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatusMetricCard
            title="Applied"
            count={appliedCount}
            color="border-blue-200 text-blue-800 bg-blue-50/60 shadow-sm"
            desc="Submitted applications awaiting response"
          />
          <StatusMetricCard
            title="Interviewing"
            count={interviewCount}
            color="border-emerald-200 text-emerald-800 bg-emerald-50/60 shadow-sm"
            desc="Active interview rounds scheduled"
          />
          <StatusMetricCard
            title="Pending Follow-Up"
            count={pendingCount}
            color="border-amber-200 text-amber-800 bg-amber-50/60 shadow-sm"
            desc="Applications awaiting review"
          />
          <StatusMetricCard
            title="Rejected"
            count={rejectedCount}
            color="border-rose-200 text-rose-800 bg-rose-50/60 shadow-sm"
            desc="Archived non-matches"
          />
        </div>
      </div>

      {/* DETECTED SKILLS PORTFOLIO */}
      {allSkills.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Key className="text-emerald-600" size={20} /> Detected Technical Skills Portfolio
          </h2>
          <p className="text-xs text-slate-500">
            Skills automatically extracted across all uploaded PDF documents:
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {allSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm hover:scale-105 transition flex items-center gap-1.5"
              >
                <CheckCircle2 size={13} className="text-emerald-600" /> {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RESUMES HISTORY & DATE-WISE ATS SCORE TRACKER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-emerald-600" size={20} /> Date-Wise Uploaded Resumes & ATS Scores
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Chronological record of scanned resumes, ATS scores, and Cloudinary PDF documents</p>
          </div>
        </div>

        {totalResumes === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-500 text-xs">No resumes uploaded yet.</p>
            <Link to="/upload" className="inline-block mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md">
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
                  className="bg-slate-50 border border-slate-200 hover:border-emerald-300 p-5 rounded-2xl space-y-3.5 transition-all duration-200 shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-lime-500 rounded-l" />

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/80 pb-3 pl-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                        <Calendar size={13} className="text-emerald-600" /> Uploaded on {formattedDate} at {formattedTime}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">ATS Score:</span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                            (r.atsScore || 0) >= 75
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm"
                              : "bg-amber-100 text-amber-800 border border-amber-300 shadow-sm"
                          }`}
                        >
                          {r.atsScore || 0} / 100
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2 sm:pl-0">
                      <a
                        href={getPdfViewerUrl(r.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-md"
                      >
                        View PDF <ExternalLink size={13} />
                      </a>
                      <a
                        href={r.fileUrl}
                        target="_blank"
                        download
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 flex items-center gap-1.5 transition shadow-sm"
                      >
                        Download <Download size={13} />
                      </a>
                    </div>
                  </div>

                  {r.aiFeedback?.summary && (
                    <p className="text-xs text-slate-700 pl-2 leading-relaxed">
                      <strong className="text-slate-900">Executive Summary:</strong> "{r.aiFeedback.summary}"
                    </p>
                  )}

                  {r.aiFeedback?.recommended_ats_keywords?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 pl-2">
                      <span className="font-semibold text-emerald-700">Target Keywords:</span>
                      {r.aiFeedback.recommended_ats_keywords.slice(0, 5).map((kw, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-[10px] font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

const StatCard = ({ title, value, icon, badge, gradient }) => (
  <div className={`bg-gradient-to-b ${gradient} border p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group hover:scale-[1.02] transition duration-200`}>
    <div className="flex justify-between items-center">
      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        {icon}
      </div>
      <span className="text-[10px] uppercase font-bold tracking-wider bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200">
        {badge}
      </span>
    </div>
    <p className="text-xs font-medium text-slate-600 mt-2">{title}</p>
    <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

const StatusMetricCard = ({ title, count, color, desc }) => (
  <div className={`p-4 rounded-2xl border ${color} space-y-1.5 shadow-sm hover:scale-[1.02] transition duration-200`}>
    <p className="text-xs font-extrabold uppercase tracking-wider">{title}</p>
    <p className="text-2xl font-black text-slate-900">{count}</p>
    <p className="text-[11px] opacity-90 leading-tight">{desc}</p>
  </div>
);
