import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Building2,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Layers,
  Sparkles,
  Save,
  X
} from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    document.title = "Job Application Pipeline Tracker | ResuMatch AI";
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/job");
      setJobs(res.data.jobs || res.data.data || []);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompany("");
    setTitle("");
    setStatus("Applied");
    setAppliedDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setCompany(job.company);
    setTitle(job.title);
    setStatus(job.apply_status || job.status || "Applied");
    setAppliedDate(
      job.applied_date
        ? new Date(job.applied_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setNotes(job.notes || "");
    setIsEditing(true);
    setEditingId(job._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !title) {
      return toast.error("Company and Title are required");
    }

    try {
      if (isEditing) {
        await API.put(`/job/${editingId}`, {
          company,
          title,
          apply_status: status,
          applied_date: appliedDate,
          notes,
        });
        toast.success("Job application updated!");
      } else {
        await API.post("/job", {
          company,
          title,
          apply_status: status,
          applied_date: appliedDate,
          notes,
        });
        toast.success("Job application logged!");
      }

      setModalOpen(false);
      resetForm();
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job application entry?")) return;

    try {
      await API.delete(`/job/${id}`);
      toast.success("Job removed from tracker");
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const currentStatus = job.apply_status || job.status || "Applied";
    const matchesStatus =
      statusFilter === "ALL" || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pipeline Counts
  const counts = {
    Total: jobs.length,
    Applied: jobs.filter((j) => (j.apply_status || j.status) === "Applied").length,
    Interview: jobs.filter((j) => (j.apply_status || j.status) === "Interview").length,
    Pending: jobs.filter((j) => (j.apply_status || j.status) === "Pending").length,
    Rejected: jobs.filter((j) => (j.apply_status || j.status) === "Rejected").length,
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            Job Tracker <Briefcase className="text-emerald-600" size={24} />
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kanban tracking for active job applications and interview stages
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-semibold rounded-xl text-sm shadow-md hover:scale-105 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add Job Application
        </button>
      </div>

      {/* PIPELINE COUNTER CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatusCountCard label="All Jobs" count={counts.Total} color="border-slate-200 bg-white text-slate-900" />
        <StatusCountCard label="Applied" count={counts.Applied} color="border-blue-200 bg-blue-50 text-blue-800" />
        <StatusCountCard label="Interviewing" count={counts.Interview} color="border-emerald-200 bg-emerald-50 text-emerald-800" />
        <StatusCountCard label="Pending" count={counts.Pending} color="border-amber-200 bg-amber-50 text-amber-800" />
        <StatusCountCard label="Rejected" count={counts.Rejected} color="border-rose-200 bg-rose-50 text-rose-800" />
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["ALL", "Applied", "Interview", "Pending", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500 gap-3">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading job applications...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4 shadow-sm">
          <Briefcase size={40} className="mx-auto text-slate-300" />
          <div>
            <p className="text-slate-900 font-semibold text-base">No job applications found</p>
            <p className="text-slate-500 text-xs mt-1">Start tracking target job applications today</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md"
          >
            Add First Application
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const currentStatus = job.apply_status || job.status || "Applied";
            return (
              <div
                key={job._id}
                className="bg-white border border-slate-200 hover:border-emerald-300 p-6 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h3>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                        <Building2 size={13} className="text-emerald-600" /> {job.company}
                      </p>
                    </div>

                    <StatusBadge status={currentStatus} />
                  </div>

                  {job.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic line-clamp-3">
                      "{job.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-emerald-600" />{" "}
                    {job.applied_date
                      ? new Date(job.applied_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(job)}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="text-emerald-600" size={20} />
                {isEditing ? "Edit Job Application" : "Log New Job Application"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Stripe"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title / Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interviewing</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Applied</label>
                  <input
                    type="date"
                    value={appliedDate}
                    onChange={(e) => setAppliedDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Salary / Job Link</label>
                <textarea
                  rows={3}
                  placeholder="Custom notes, recruiter contact, or link..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  {isEditing ? "Save Changes" : "Log Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;

const StatusCountCard = ({ label, count, color }) => (
  <div className={`p-3.5 rounded-2xl border ${color} shadow-sm space-y-0.5 text-center`}>
    <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</p>
    <p className="text-xl font-extrabold">{count}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  switch (status) {
    case "Interview":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <CheckCircle2 size={12} /> Interview
        </span>
      );
    case "Pending":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
          <Clock size={12} /> Pending
        </span>
      );
    case "Rejected":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <XCircle size={12} /> Rejected
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
          <Briefcase size={12} /> Applied
        </span>
      );
  }
};