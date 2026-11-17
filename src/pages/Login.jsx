import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Gamepad2, Eye, EyeOff } from "lucide-react";

import { loginUser } from "../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const result = await dispatch(
      loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  const inputStyle =
    "w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#100E1B] px-4 py-10">

      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#292929] rounded-2xl p-8 shadow-xl">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">
            <div className="bg-purple-500/10 p-4 rounded-full">
              <Gamepad2 size={32} className="text-purple-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">
            GAME <span className="text-purple-500">DOCK</span>
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Welcome back, Player!
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={inputStyle}
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm block mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={inputStyle}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-2">{errors.password}</p>
            )}
          </div>

          {/* Server Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 text-sm mt-7">
          Don't have an account?

          <Link to="/register" className="text-purple-400 ml-2 hover:text-purple-300">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
