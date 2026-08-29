import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Briefcase,
  FileText,
  Target,
  Layers,
  Key,
  ListOrdered,
  XCircle,
  FileSearch,
  ArrowRight,
  Sliders,
  Check,
  FileCode
} from "lucide-react";

const Upload = () => {
  const [activeTab, setActiveTab] = useState("ats-analysis"); // "ats-analysis" | "jd-match"

  // Standard Upload State
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  // JD Matcher State
  const [jdFile, setJdFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdLoading, setJdLoading] = useState(false);
  const [jdResult, setJdResult] = useState(null);

  useEffect(() => {
    document.title = "Resume ATS Report & JD Matcher | ResuMatch AI";
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleJdFileChange = (e) => {
    if (e.target.files[0]) {
      setJdFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a PDF file first");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post("/resume/upload", formData);
      toast.success("Resume uploaded & analyzed cleanly!");
      setResult(res.data.aiFeedback || res.data);
      setExtractedText(res.data.extractedText || "");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleJDMatch = async () => {
    if (!jobDescription || jobDescription.trim().length < 15) {
      return toast.error("Please paste a target Job Description (min 15 characters)");
    }

    if (!jdFile && !extractedText && (!result || !result.extractedText)) {
      return toast.error("Please upload your PDF resume file in Box 1 below!");
    }

    try {
      setJdLoading(true);
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);

      if (jdFile) {
        formData.append("resume", jdFile);
      } else if (extractedText || result?.extractedText) {
        formData.append("resumeText", extractedText || result?.extractedText);
      }

      const res = await API.post("/resume/analyze-jd", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Job Description Match completed!");
      setJdResult(res.data.data);
      if (res.data.extractedText) {
        setExtractedText(res.data.extractedText);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "JD Match failed");
    } finally {
      setJdLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 sm:p-8 max-w-6xl mx-auto flex flex-col items-center">
      
      {/* HEADER */}
      <div className="text-center max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
          <Sparkles size={14} className="text-emerald-600" /> Professional ATS Auditor & Matching Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
          Upload Your Resume <FileText className="text-emerald-600 inline" size={32} />
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Get instantaneous ATS scoring, recommended keywords to add, weak section fixes, optimal section ordering, and match your resume against any Job Description (JD).
        </p>
      </div>

      {/* MODE SELECTOR TABS */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 mb-8 w-full max-w-md shadow-md">
        <button
          onClick={() => setActiveTab("ats-analysis")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "ats-analysis"
              ? "bg-gradient-to-r from-emerald-600 to-lime-500 text-white shadow-md shadow-emerald-500/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText size={15} /> Standard ATS Analysis
        </button>

        <button
          onClick={() => setActiveTab("jd-match")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === "jd-match"
              ? "bg-gradient-to-r from-emerald-600 to-lime-500 text-white shadow-md shadow-emerald-500/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Target size={15} /> Match vs Job Description
        </button>
      </div>

      {/* TAB 1: STANDARD ATS RESUME ANALYSIS */}
      {activeTab === "ats-analysis" && (
        <div className="w-full space-y-8 flex flex-col items-center">
          {/* UPLOAD CARD */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl w-full max-w-xl shadow-xl space-y-6">
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition bg-slate-50 group cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition shadow-sm">
                <UploadCloud size={28} />
              </div>
              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                    <FileCheck2 size={16} /> {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click or drag & drop your PDF resume here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PDF files up to 10MB supported</p>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Run Resume ATS Analysis
                </>
              )}
            </button>
          </div>

          {/* DETAILED ATS REPORT */}
          {result && (
            <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
              {/* HEADER BAR */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="text-emerald-600" size={24} /> Resume ATS Report
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Generated based on industry recruiter benchmarks</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-4xl font-black text-emerald-600">
                      {result.overall_score || result.atsScore || 75}
                    </span>
                    <span className="text-slate-500 text-sm">/100</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      (result.overall_score || result.atsScore || 75) >= 75
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {(result.overall_score || result.atsScore || 75) >= 75 ? "Excellent Match" : "Needs Optimization"}
                  </div>
                </div>
              </div>

              {/* EXECUTIVE SUMMARY */}
              {result.summary && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" /> Executive Summary
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              )}

              {/* RECOMMENDED ATS KEYWORDS TO ADD */}
              {result.recommended_ats_keywords?.length > 0 && (
                <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                    <Key size={16} className="text-emerald-600" /> Recommended ATS Keywords to Add
                  </h3>
                  <p className="text-xs text-slate-600">
                    Including these high-value industry keywords will significantly boost your score across corporate screening software:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.recommended_ats_keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-white border border-emerald-300 text-emerald-900 px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                      >
                        <Check size={12} className="text-emerald-600" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OPTIMAL RESUME SECTION SEQUENCE */}
              {result.section_sequence_recommendation?.length > 0 && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ListOrdered size={16} className="text-emerald-600" /> Recommended Section Sequence & Structure
                  </h3>
                  <p className="text-xs text-slate-500">
                    Follow this optimal section ordering to pass ATS parser readers seamlessly:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                    {result.section_sequence_recommendation.map((seq, i) => (
                      <div
                        key={i}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-sm"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span>{seq.replace(/^\d+\.\s*/, "")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WEAK SECTIONS & FIXES BREAKDOWN */}
              {result.weak_sections?.length > 0 && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-2">
                    <AlertTriangle size={16} /> Weak Sections Audit & How to Fix
                  </h3>
                  <div className="space-y-3 pt-1">
                    {result.weak_sections.map((item, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-rose-200 space-y-1.5 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-rose-800">{item.section}</span>
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Needs Attention</span>
                        </div>
                        <p className="text-xs text-slate-600"><strong className="text-slate-800">Issue:</strong> {item.issue}</p>
                        <p className="text-xs text-emerald-700"><strong className="text-emerald-900">Actionable Fix:</strong> {item.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS PROFILE */}
              {result.skills && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Detected Skills Profile
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.technical?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {result.skills.soft?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* STRENGTHS & WEAKNESSES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* STRENGTHS */}
                {result.strengths?.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                      <CheckCircle2 size={18} /> Strengths Highlight
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.strengths.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* WEAKNESSES */}
                {result.weaknesses?.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                      <AlertTriangle size={18} /> Areas to Enhance
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {result.weaknesses.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SUGGESTIONS */}
              {result.improvement_suggestions?.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <Lightbulb size={18} className="text-emerald-600" /> Actionable Line & Bullet Rewrites
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {result.improvement_suggestions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* BEST ROLES */}
              {result.best_job_roles?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Briefcase size={16} className="text-emerald-600" /> Recommended Job Roles & Candidate Fit
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.best_job_roles.map((role, i) => (
                      <span
                        key={i}
                        className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-xl text-xs font-bold shadow-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JOB DESCRIPTION (JD) KEYWORD MATCHER WITH INTEGRATED FILE UPLOAD */}
      {activeTab === "jd-match" && (
        <div className="w-full max-w-5xl space-y-8">
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-2xl shadow-sm">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Target Job Description (JD) Keyword Matcher</h2>
                <p className="text-xs text-slate-500">Upload your PDF resume and paste any target job description to analyze keyword match %</p>
              </div>
            </div>

            {/* TWO INPUT BOXES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* BOX 1: RESUME FILE UPLOAD */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={15} className="text-emerald-600" /> Box 1: Upload Resume (PDF)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition bg-slate-50 group cursor-pointer relative h-52 flex flex-col justify-center items-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleJdFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-sm">
                      <UploadCloud size={24} />
                    </div>
                    {jdFile ? (
                      <div className="space-y-1 px-2">
                        <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1 line-clamp-1">
                          <FileCheck2 size={14} /> {jdFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {(jdFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Drop PDF resume here or click to browse
                        </p>
                        {file && (
                          <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center justify-center gap-1">
                            <CheckCircle2 size={13} className="text-emerald-600" /> Using uploaded resume: {file.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOX 2: JOB DESCRIPTION TEXT AREA */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode size={15} className="text-emerald-600" /> Box 2: Job Description Text
                </label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job posting text here (e.g. We are looking for a Senior Full Stack Engineer with 3+ years experience in React, Node.js, Docker, AWS...)"
                  className="w-full h-52 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500 transition leading-relaxed resize-none"
                />
              </div>

            </div>

            <button
              onClick={handleJDMatch}
              disabled={jdLoading || !jobDescription || (!jdFile && !file && !extractedText)}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {jdLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Matching Resume vs Job Description...</span>
                </>
              ) : (
                <>
                  <Target size={18} /> Compare Resume Against Job Description
                </>
              )}
            </button>
          </div>

          {/* JD MATCH RESULT DISPLAY */}
          {jdResult && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="text-emerald-600" size={22} /> Job Description Match Results
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Role Alignment & Keyword Coverage Analysis</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-4xl font-black text-emerald-600">
                      {jdResult.jd_match_score}%
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      jdResult.jd_match_score >= 75
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {jdResult.jd_match_score >= 75 ? "High JD Alignment" : "Needs Keyword Tuning"}
                  </div>
                </div>
              </div>

              {/* ALIGNMENT SUMMARY */}
              {jdResult.alignment_summary && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Alignment Summary</h4>
                  <p className="text-sm text-slate-800">{jdResult.alignment_summary}</p>
                </div>
              )}

              {/* MATCHED VS MISSING KEYWORDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MATCHED KEYWORDS */}
                <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" /> Matched Keywords ({jdResult.matching_keywords?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {jdResult.matching_keywords?.map((kw, i) => (
                      <span key={i} className="bg-white border border-emerald-300 text-emerald-900 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MISSING KEYWORDS */}
                <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                    <XCircle size={16} className="text-rose-600" /> Missing Keywords in Resume ({jdResult.missing_jd_keywords?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {jdResult.missing_jd_keywords?.map((kw, i) => (
                      <span key={i} className="bg-white border border-rose-300 text-rose-800 px-3 py-1 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1">
                        <XCircle size={13} className="text-rose-600" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CUSTOMIZED BULLET RECOMMENDATIONS FOR THIS JD */}
              {jdResult.customized_bullet_recommendations?.length > 0 && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-600" /> Recommended Bullet Tweaks for This Job Posting
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {jdResult.customized_bullet_recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;