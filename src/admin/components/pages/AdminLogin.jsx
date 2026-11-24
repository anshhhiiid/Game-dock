import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import { adminLogin } from "../../../redux/slices/adminAuthSlice";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.adminAuth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await dispatch(adminLogin(formData)).unwrap();

      toast.success("Admin login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl p-8 shadow-2xl">

        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            <ShieldCheck size={35} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold text-center">
          GAME DOCK
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Admin Dashboard Login
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="text-gray-300 text-sm">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              className="w-full mt-2 p-3 rounded-lg bg-[#080b12] border border-gray-700 text-white outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3 pr-12 rounded-lg bg-[#080b12] border border-gray-700 text-white outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>

        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          Authorized GAME DOCK administrators only.
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;