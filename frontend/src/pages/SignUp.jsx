import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 optional auto-login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await API.post("/user/signIn", formData);

      toast.success("Account created successfully");

      // 🔥 OPTION 1: Redirect to login
      navigate("/");

      // 🔥 OPTION 2 (better UX): auto-login
      // login(res.data.token);
      // navigate("/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.Message || "Signup Failed");
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
        <h1 className="text-3xl font-semibold">Create Account</h1>

        {/* FIRST NAME */}
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="mt-6 w-full p-3 rounded-lg bg-white/10 outline-none"
          onChange={handleChange}
          required
        />

        {/* LAST NAME */}
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="mt-4 w-full p-3 rounded-lg bg-white/10 outline-none"
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mt-4 w-full p-3 rounded-lg bg-white/10 outline-none"
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
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* LOGIN LINK */}
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;