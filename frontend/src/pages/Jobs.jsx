import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    apply_status: "Applied",
    note: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/job");
      setJobs(res.data.data);
    } catch {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/job/${editId}`, formData);
        toast.success("Job updated");
      } else {
        await API.post("/job/addJob", formData);
        toast.success("Job added");
      }

      setFormData({
        company_name: "",
        role: "",
        apply_status: "Applied",
        note: "",
      });

      setEditId(null);
      fetchJobs();

    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (job) => {
    setFormData(job);
    setEditId(job._id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/job/${id}`);
      toast.success("Deleted");
      fetchJobs();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/job/${id}`, { apply_status: status });
      fetchJobs();
    } catch {
      toast.error("Update failed");
    }
  };

  // 🔥 STATS CALCULATION
  const statuses = ["Applied", "Interview", "Rejected", "Pending"];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">

      <h1 className="text-3xl font-bold mb-6">Job Tracker 🚀</h1>

      {/* 🔥 STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statuses.map((status) => (
          <div key={status} className="bg-white/10 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">{status}</p>
            <p className="text-2xl font-bold">
              {jobs.filter((j) => j.apply_status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 p-4 rounded-xl mb-6 grid md:grid-cols-4 gap-3"
      >
        <input
          name="company_name"
          placeholder="Company"
          className="p-2 rounded bg-gray-800"
          value={formData.company_name}
          onChange={handleChange}
          required
        />

        <input
          name="role"
          placeholder="Role"
          className="p-2 rounded bg-gray-800"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <select
          name="apply_status"
          className="p-2 rounded bg-gray-800"
          value={formData.apply_status}
          onChange={handleChange}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button className="bg-indigo-600 rounded px-4">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* LOADING */}
      {loading && <p className="text-gray-400">Loading...</p>}

      {/* LIST */}
      <div className="bg-white/10 p-4 rounded-xl">

        {jobs.length === 0 ? (
          <p className="text-gray-400">No jobs added yet 🚫</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="border-b border-gray-700 py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{job.company_name}</p>
                <p className="text-sm text-gray-400">{job.role}</p>

                <select
                  value={job.apply_status}
                  onChange={(e) =>
                    handleStatusChange(job._id, e.target.value)
                  }
                  className="bg-gray-800 mt-1 p-1 rounded"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Jobs;