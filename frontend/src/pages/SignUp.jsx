import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, ArrowRight, FileText, ShieldCheck } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await API.post("/user/signIn", formData);
      toast.success("Account created successfully!");

      // Auto login user
      const loginRes = await API.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      login(loginRes.data.token);
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.response?.data?.Message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 text-slate-800 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        {/* BRAND BADGE */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-2xl mb-3">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 text-white shadow-md shadow-emerald-500/20">
              <FileText size={22} />
            </div>
            <span className="text-slate-900">Resu<span className="text-emerald-600">Match AI</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Free Account</h1>
          <p className="text-xs text-slate-500 mt-1">Start evaluating your resume with AI precision</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 text-xs"
          >
            {loading ? "Creating..." : "Create Free Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline font-bold">
            Login
          </Link>
        </div>

        <div className="mt-4 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 font-medium">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>100% Encrypted & Private Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;