import { Link } from "react-router-dom";
import { FileText, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* COL 1: BRAND */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-emerald-500 to-lime-500 text-white">
              <FileText size={18} />
            </div>
            <span>
              Resu<span className="text-emerald-400">Match AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Empowering job seekers with AI-powered resume scoring, Applicant Tracking System (ATS) optimization, and real-time application pipeline tracking.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>100% Secure • Gemini AI</span>
          </div>
        </div>

        {/* COL 2: PLATFORM */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform Features</p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/upload" className="hover:text-emerald-400 transition">AI Resume Analyzer</Link></li>
            <li><Link to="/upload" className="hover:text-emerald-400 transition">Job Description Matcher</Link></li>
            <li><Link to="/jobs" className="hover:text-emerald-400 transition">Job Tracker Pipeline</Link></li>
            <li><Link to="/profile" className="hover:text-emerald-400 transition">Profile Analytics Hub</Link></li>
          </ul>
        </div>

        {/* COL 3: TOOLS & ACCOUNT */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Account & Tools</p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li><Link to="/dashboard" className="hover:text-emerald-400 transition">User Dashboard</Link></li>
            <li><Link to="/upload" className="hover:text-emerald-400 transition">Upload PDF Resume</Link></li>
            <li><Link to="/jobs" className="hover:text-emerald-400 transition">Application Tracker</Link></li>
            <li><Link to="/signup" className="hover:text-emerald-400 transition">Create Account</Link></li>
          </ul>
        </div>

        {/* COL 4: TECH STACK */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Powered By</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 text-[11px] font-medium border border-slate-700">Google Gemini AI</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-teal-300 text-[11px] font-medium border border-slate-700">React & Vite</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-lime-300 text-[11px] font-medium border border-slate-700">Node.js & Express</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 text-[11px] font-medium border border-slate-700">MongoDB Atlas</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 text-[11px] font-medium border border-slate-700">Cloudinary CDN</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
        <p>© {new Date().getFullYear()} ResuMatch AI. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for career growth <Heart size={12} className="text-emerald-500 fill-emerald-500" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
