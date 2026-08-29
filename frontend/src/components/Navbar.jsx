import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";
import {
  FileText,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  UploadCloud,
  Briefcase,
  Sparkles,
  Lock,
  User
} from "lucide-react";

const Navbar = ({ onOpenAuthModal }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMenuOpen(false);
    if (onOpenAuthModal) onOpenAuthModal(mode);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProtectedFeatureClick = (e, featureName, targetPath) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error(`Please login first to access ${featureName}!`, {
        id: `nav-auth-${featureName}`,
      });
      handleOpenAuth("login");
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800 px-4 sm:px-8 py-3.5 flex justify-between items-center transition-all shadow-sm">
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-500 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <FileText className="text-white" size={20} />
          </div>
          <span className="text-slate-900">
            Resu<span className="text-emerald-600">Match AI</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className={`hover:text-emerald-600 transition ${location.pathname === "/" ? "text-emerald-600 font-semibold" : ""}`}>
            Home
          </Link>

          <Link
            to="/dashboard"
            onClick={(e) => handleProtectedFeatureClick(e, "Dashboard", "/dashboard")}
            className={`flex items-center gap-1.5 transition ${
              location.pathname === "/dashboard"
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600"
            }`}
          >
            <LayoutDashboard size={16} /> Dashboard
            {!isAuthenticated && <Lock size={12} className="text-slate-400" />}
          </Link>

          <Link
            to="/upload"
            onClick={(e) => handleProtectedFeatureClick(e, "Upload Resume", "/upload")}
            className={`flex items-center gap-1.5 transition ${
              location.pathname === "/upload"
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600"
            }`}
          >
            <UploadCloud size={16} /> Upload & JD Matcher
            {!isAuthenticated && <Lock size={12} className="text-slate-400" />}
          </Link>

          <Link
            to="/jobs"
            onClick={(e) => handleProtectedFeatureClick(e, "Job Tracker", "/jobs")}
            className={`flex items-center gap-1.5 transition ${
              location.pathname === "/jobs"
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600"
            }`}
          >
            <Briefcase size={16} /> Job Tracker
            {!isAuthenticated && <Lock size={12} className="text-slate-400" />}
          </Link>

          <Link
            to="/profile"
            onClick={(e) => handleProtectedFeatureClick(e, "Profile Analytics", "/profile")}
            className={`flex items-center gap-1.5 transition ${
              location.pathname === "/profile"
                ? "text-emerald-600 font-semibold"
                : "hover:text-emerald-600"
            }`}
          >
            <User size={16} /> Profile Analytics
            {!isAuthenticated && <Lock size={12} className="text-slate-400" />}
          </Link>
        </div>

        {/* AUTH / PROFILE BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleOpenAuth("login")}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                Login
              </button>
              <button
                onClick={() => handleOpenAuth("signup")}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-105 transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Sparkles size={16} /> Create Free Account
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-700 transition shadow-sm"
              >
                <User size={14} className="text-emerald-600" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs"
                title="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl focus:outline-none"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white/95 border-b border-slate-200 p-6 flex flex-col gap-4 text-slate-700 md:hidden shadow-xl backdrop-blur-xl">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 py-1 font-medium"
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              onClick={(e) => handleProtectedFeatureClick(e, "Dashboard", "/dashboard")}
              className="flex items-center justify-between py-1 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2"><LayoutDashboard size={18} /> Dashboard</span>
              {!isAuthenticated && <Lock size={14} className="text-slate-400" />}
            </Link>

            <Link
              to="/upload"
              onClick={(e) => handleProtectedFeatureClick(e, "Upload Resume", "/upload")}
              className="flex items-center justify-between py-1 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2"><UploadCloud size={18} /> Upload & JD Matcher</span>
              {!isAuthenticated && <Lock size={14} className="text-slate-400" />}
            </Link>

            <Link
              to="/jobs"
              onClick={(e) => handleProtectedFeatureClick(e, "Job Tracker", "/jobs")}
              className="flex items-center justify-between py-1 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2"><Briefcase size={18} /> Job Tracker</span>
              {!isAuthenticated && <Lock size={14} className="text-slate-400" />}
            </Link>

            <Link
              to="/profile"
              onClick={(e) => handleProtectedFeatureClick(e, "Profile Analytics", "/profile")}
              className="flex items-center justify-between py-1 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2"><User size={18} /> Profile</span>
              {!isAuthenticated && <Lock size={14} className="text-slate-400" />}
            </Link>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleOpenAuth("login")}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-center font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleOpenAuth("signup")}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-lime-500 text-white rounded-xl text-center font-semibold shadow-md"
                  >
                    Create Free Account
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-center font-medium flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;