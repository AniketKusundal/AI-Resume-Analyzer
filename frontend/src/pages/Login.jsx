import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 use context

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/user/login", formData);

      login(res.data.token); // ✅ context login
      toast.success("Login successful");

      navigate("/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.Message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10"
      >
        <h1 className="text-3xl font-semibold">Login</h1>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mt-6 w-full p-3 rounded-lg bg-white/10 outline-none"
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="mt-4 w-full p-3 rounded-lg bg-white/10 outline-none"
          onChange={handleChange}
          required
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 py-3 rounded-lg hover:bg-indigo-500 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Login;