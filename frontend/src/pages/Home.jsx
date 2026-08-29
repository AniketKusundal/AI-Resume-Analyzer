import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Sparkles,
  Zap,
  Target,
  FileCheck,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Star,
  ChevronDown,
  Brain,
  UploadCloud,
  FileText,
  Check,
  X,
  Award,
  Layers,
  BarChart3,
  Building2,
  Lock,
  Cloud,
  Database,
  CheckSquare,
  AlertTriangle,
  Lightbulb,
  FileSearch,
  PieChart
} from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [faqOpen, setFaqOpen] = useState(null);

  // Hero Drop Upload State
  const [uploading, setUploading] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState("ai-analysis");

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isAuthenticated) {
      toast.error("Please login first to analyze your resume!", {
        id: "hero-login-toast",
      });
      openAuth("login");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file);
      toast.loading("Analyzing your PDF with Gemini AI...", { id: "hero-upload" });

      const res = await API.post("/resume/upload", formData);
      toast.success("Resume analyzed & saved to dashboard!", { id: "hero-upload" });
      navigate("/dashboard");
    } catch (err) {
      toast.error("Upload failed", { id: "hero-upload" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">

      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 py-2.5 px-4 text-center text-xs font-semibold text-emerald-100 flex items-center justify-center gap-2 shadow-sm">
        <span className="flex items-center gap-1 text-amber-300 font-bold">
          <Star size={13} fill="currentColor" /> 4.9 / 5 Rating
        </span>
        <span className="hidden sm:inline text-emerald-400">•</span>
        <span>Trusted by job seekers & tech professionals worldwide</span>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Fresh Green Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold mb-6 shadow-sm">
          <Sparkles className="text-emerald-600 animate-spin" size={15} />
          <span>Powered by Gemini 1.5 Neural Engine</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] text-slate-900 max-w-5xl mb-6">
          Optimize Your Resume & <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600">Land High-Paying Offers</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed font-normal">
          Instant recruiter-grade ATS scoring, technical skill extraction, missing keyword detection, and real-time application tracking.
        </p>

        {/* HERO UPLOAD DROPZONE CARD */}
        <div className="w-full max-w-2xl bg-white border border-slate-200 hover:border-emerald-400 rounded-3xl p-8 sm:p-10 shadow-xl transition duration-300 relative group mb-12">
          <input
            type="file"
            accept=".pdf"
            onChange={handleHeroFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition shadow-sm">
              <UploadCloud size={34} />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                Drop your PDF resume here or <span className="text-emerald-600 underline underline-offset-4">browse files</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports English PDF resumes up to 10MB
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald-600" /> BCrypt & JWT Encrypted</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-600" /> Instant Gemini 1.5 Analysis</span>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left border-t border-slate-200 pt-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ATS Match Score</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">0 - 100 Meter</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Recruiter benchmarks</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill Gap Audit</p>
            <p className="text-2xl font-black text-lime-600 mt-1">Tech & Soft</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Categorized skill list</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Application Tracker</p>
            <p className="text-2xl font-black text-teal-600 mt-1">4 Statuses</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Applied, Interview, etc.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cloud Storage</p>
            <p className="text-2xl font-black text-amber-600 mt-1">Cloudinary CDN</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Encrypted document viewer</p>
          </div>
        </div>
      </section>

      {/* SYSTEM FEATURES SHOWCASE */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase mb-2">Platform Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">System Overview</p>
          <p className="text-slate-600 text-sm mt-2">
            Engineered with modern AI models, Node.js backend services, and a crisp React interface.
          </p>
        </div>

        {/* FEATURE TABS SELECTOR */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: "ai-analysis", label: "AI Resume Analyzer", icon: <Brain size={16} /> },
            { id: "job-tracker", label: "Job Application Tracker", icon: <Briefcase size={16} /> },
            { id: "dashboard", label: "Dashboard Analytics", icon: <BarChart3 size={16} /> },
            { id: "cloud-security", label: "Security & Cloud Vault", icon: <Lock size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeFeatureTab === tab.id
                  ? "bg-gradient-to-r from-emerald-600 to-lime-500 text-white shadow-md shadow-emerald-500/20 scale-105"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT CARDS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto shadow-xl">

          {/* TAB 1: AI RESUME ANALYSIS */}
          {activeFeatureTab === "ai-analysis" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-700">
                  <Brain size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Google Gemini Neural Resume Engine</h3>
                  <p className="text-xs text-slate-500">Deep structural text parsing via pdf-parse & Gemini 1.5 Flash</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <FeatureCard
                  icon={<Award className="text-emerald-600" size={20} />}
                  title="ATS Score Meter (0-100)"
                  desc="Algorithmic match score calculated against senior recruiter benchmarks."
                />
                <FeatureCard
                  icon={<FileSearch className="text-teal-600" size={20} />}
                  title="Executive Summary"
                  desc="Generates a clear candidate summary highlighting core professional background."
                />
                <FeatureCard
                  icon={<CheckSquare className="text-emerald-600" size={20} />}
                  title="Skills Audit"
                  desc="Extracts technical frameworks (React, Node, Mongo) & soft communication traits."
                />
                <FeatureCard
                  icon={<CheckCircle2 className="text-emerald-600" size={20} />}
                  title="Candidate Strengths"
                  desc="Pinpoints resume highlights, quantifiable impact metrics, and project scope."
                />
                <FeatureCard
                  icon={<AlertTriangle className="text-amber-600" size={20} />}
                  title="Improvement Areas"
                  desc="Highlights missing bullet metrics, passive verbs, or formatting gaps."
                />
                <FeatureCard
                  icon={<Lightbulb className="text-lime-600" size={20} />}
                  title="Target Job Matching"
                  desc="Recommends target job titles where candidate match confidence is highest."
                />
              </div>
            </div>
          )}

          {/* TAB 2: JOB APPLICATION TRACKER */}
          {activeFeatureTab === "job-tracker" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 bg-teal-100 border border-teal-200 rounded-2xl text-teal-700">
                  <Briefcase size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Kanban Job Application Pipeline</h3>
                  <p className="text-xs text-slate-500">Full CRUD tracking for every job application</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <FeatureCard
                  icon={<Building2 className="text-emerald-600" size={20} />}
                  title="Company & Role Tracking"
                  desc="Log target company name, role title, custom notes, and applied date."
                />
                <FeatureCard
                  icon={<PieChart className="text-teal-600" size={20} />}
                  title="4 Status Pipeline Categories"
                  desc="Seamlessly switch status between Applied, Interview, Rejected, and Pending."
                />
                <FeatureCard
                  icon={<Layers className="text-lime-600" size={20} />}
                  title="Real-Time Application Metrics"
                  desc="Live count cards showing exact active applications in each pipeline stage."
                />
              </div>
            </div>
          )}

          {/* TAB 3: DASHBOARD ANALYTICS */}
          {activeFeatureTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 bg-lime-100 border border-lime-200 rounded-2xl text-lime-700">
                  <BarChart3 size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Personal User Analytics Dashboard</h3>
                  <p className="text-xs text-slate-500">Aggregated insights across all uploaded resumes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FeatureCard
                  icon={<FileText className="text-emerald-600" size={20} />}
                  title="Total Resumes Count"
                  desc="Track every resume variation uploaded over time."
                />
                <FeatureCard
                  icon={<TrendingUp className="text-teal-600" size={20} />}
                  title="Average ATS Score"
                  desc="Calculates overall profile health score across all uploads."
                />
                <FeatureCard
                  icon={<Award className="text-lime-600" size={20} />}
                  title="Peak Score Meter"
                  desc="Highlights your highest scoring resume document ready for applications."
                />
              </div>
            </div>
          )}

          {/* TAB 4: CLOUD STORAGE & SECURITY */}
          {activeFeatureTab === "cloud-security" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-2xl text-emerald-700">
                  <Lock size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Enterprise Security & Cloud Vault</h3>
                  <p className="text-xs text-slate-500">BCrypt password hashing, JWT authorization & Cloudinary CDN</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <FeatureCard
                  icon={<ShieldCheck className="text-emerald-600" size={20} />}
                  title="BCrypt & JWT Auth"
                  desc="Passwords encrypted with 10 salt rounds. Secure bearer tokens."
                />
                <FeatureCard
                  icon={<Cloud className="text-teal-600" size={20} />}
                  title="Cloudinary PDF Vault"
                  desc="Resumes uploaded directly to Cloudinary CDN for instant viewing."
                />
                <FeatureCard
                  icon={<Database className="text-lime-600" size={20} />}
                  title="MongoDB Relational Storage"
                  desc="User profiles, resume feedback JSON objects, and job application schemas."
                />
              </div>
            </div>
          )}

        </div>
      </section>

      {/* HOW IT WORKS PROCESS */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-extrabold tracking-widest text-emerald-700 uppercase mb-2">Step-by-Step</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">How ResuMatch AI Works</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Upload PDF Resume</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Upload your PDF document. Our backend extracts text via `pdf-parse` and uploads the PDF to Cloudinary CDN.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-lime-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Gemini AI Analysis</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Google Gemini evaluates overall ATS score, categorizes technical/soft skills, and generates improvement recommendations.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Track Applications</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Log job applications in your Job Tracker pipeline and monitor your status from Applied to Interview and Offer.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-lime-700 border border-emerald-600 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden shadow-xl text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold">
              Get Started with ResuMatch AI Today
            </h2>
            <p className="text-emerald-100 text-base">
              Upload your PDF resume once to receive instant AI scoring and organize your job search pipeline.
            </p>
            {isAuthenticated ? (
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 font-extrabold rounded-2xl shadow-xl hover:bg-slate-100 transition text-base"
              >
                Upload Resume Now <ArrowRight size={18} />
              </Link>
            ) : (
              <button
                onClick={() => openAuth("signup")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 font-extrabold rounded-2xl shadow-xl hover:bg-slate-100 transition text-base whitespace-nowrap"
              >
                <Sparkles size={18} /> Create Account & Analyze Resume
              </button>
            )}
          </div>
        </div>
      </section>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Home;

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-2 hover:border-slate-300 transition shadow-sm">
    <div className="p-2.5 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
  </div>
);
