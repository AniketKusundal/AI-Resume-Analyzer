import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 📌 handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 📌 upload resume
  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post("/resume/upload", formData);

      toast.success("Resume uploaded & analyzed!");
      setResult(res.data);

    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        Upload Resume 📄
      </h1>

      {/* UPLOAD CARD */}
      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/10 w-full max-w-md">

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 w-full text-sm"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 py-3 rounded-lg hover:bg-indigo-500 transition"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

      </div>

      {/* RESULT CARD */}
      {result && (
        <div className="mt-8 w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Resume Analysis
            </h2>

            <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-medium">
              ATS Score: {result.atsScore}
            </span>
          </div>

          {/* SUMMARY */}
          <div className="mb-5">
            <h3 className="text-gray-400 text-sm mb-1">Summary</h3>
            <p className="text-gray-100 leading-relaxed">
              {result.aiFeedback?.summary}
            </p>
          </div>

          {/* SKILLS */}
          {result.aiFeedback?.skills && (
            <div className="mb-5">
              <h3 className="text-blue-400 text-sm mb-2">Skills</h3>

              <div className="flex flex-wrap gap-2">
                {result.aiFeedback.skills.technical?.map((skill, i) => (
                  <span key={i} className="bg-blue-600/20 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}

                {result.aiFeedback.skills.soft?.map((skill, i) => (
                  <span key={i} className="bg-purple-600/20 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STRENGTHS */}
          {result.aiFeedback?.strengths?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-green-400 text-sm mb-2">Strengths</h3>
              <ul className="list-disc pl-5 text-gray-200 space-y-1">
                {result.aiFeedback.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* WEAKNESSES */}
          {result.aiFeedback?.weaknesses?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-red-400 text-sm mb-2">Areas to Improve</h3>
              <ul className="list-disc pl-5 text-gray-200 space-y-1">
                {result.aiFeedback.weaknesses.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* SUGGESTIONS */}
          {result.aiFeedback?.improvement_suggestions?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-yellow-400 text-sm mb-2">Suggestions</h3>
              <ul className="list-disc pl-5 text-gray-200 space-y-1">
                {result.aiFeedback.improvement_suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* BEST ROLES */}
          {result.aiFeedback?.best_job_roles?.length > 0 && (
            <div>
              <h3 className="text-indigo-400 text-sm mb-2">Best Job Roles</h3>
              <div className="flex flex-wrap gap-2">
                {result.aiFeedback.best_job_roles.map((role, i) => (
                  <span key={i} className="bg-indigo-600/20 px-3 py-1 rounded-full text-sm">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Upload;