import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // 🔥 check login

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); // refresh UI
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-white/10 px-6 py-3 flex justify-between items-center relative">

      {/* LOGO */}
      <h1 className="text-xl font-bold">AI Resume</h1>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6">

        {/* 🔥 BEFORE LOGIN */}
        {!token && (
          <>
            <Link to="/" className="hover:text-indigo-400">
              Login
            </Link>
            <Link to="/signup" className="hover:text-indigo-400">
              Signup
            </Link>
          </>
        )}

        {/* 🔥 AFTER LOGIN */}
        {token && (
          <>
            <Link to="/dashboard" className="hover:text-indigo-400">
              Dashboard
            </Link>

            <Link to="/upload" className="hover:text-indigo-400">
              Upload
            </Link>

            <Link to="/jobs" className="hover:text-indigo-400">
              Jobs
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1.5 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-2xl"
      >
        ☰
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-gray-900 flex flex-col items-center gap-4 py-4 md:hidden">

          {!token && (
            <>
              <Link to="/">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}

          {token && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/upload">Upload</Link>
              <Link to="/jobs">Jobs</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;