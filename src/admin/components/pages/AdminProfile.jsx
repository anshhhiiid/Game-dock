import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Settings2,
} from "lucide-react";

import { updateAdminProfile } from "../../../redux/slices/adminAuthSlice";

function AdminProfile() {
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.adminAuth.admin);
  const loading = useSelector((state) => state.adminAuth.loading);

  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admin?.id) {
      toast.error("Admin information not found. Please login again.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const changingPassword = Boolean(
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    );

    if (changingPassword) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        toast.error("Please complete all password fields.");
        return;
      }

      if (formData.newPassword.length < 8) {
        toast.error("New password must contain at least 8 characters.");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match.");
        return;
      }
    }

    try {
      await dispatch(
        updateAdminProfile({
          id: admin.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        })
      ).unwrap();

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to update profile."
      );
    }
  };

  // Styling
  const inputClass =
    "w-full bg-[#101014] border border-white/[0.08] rounded-xl px-4 py-3 pl-11 text-white text-sm outline-none transition-all placeholder:text-gray-600 focus:border-purple-500/60 focus:bg-[#131319]";

  const labelClass =
    "block text-sm text-gray-300 font-medium mb-2";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-500";

  const sectionClass =
    "bg-[#151519] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6";

  const initial = formData.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="max-w-6xl mx-auto pb-8">

      {/* PAGE HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
          <Settings2 size={14} />
          <span>Administration</span>
          <span>/</span>
          <span className="text-gray-300">Profile Settings</span>
        </div>

        <h1 className="text-3xl font-bold text-white tracking-tight">
          Admin Profile
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Manage your account information and security preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* PROFILE OVERVIEW */}

        <div className="bg-[#151519] border border-white/[0.07] rounded-2xl p-6 md:p-8 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* AVATAR */}

            <div className="w-20 h-20 rounded-2xl bg-[#22202B] border border-purple-500/20 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold text-purple-300">
                {initial}
              </span>
            </div>

            {/* ADMIN DETAILS */}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-white">
                  {formData.name || "Admin Name"}
                </h2>

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-300 text-[10px] font-semibold uppercase tracking-wider">
                  <ShieldCheck size={13} />
                  Administrator
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-2">
                {formData.email}
              </p>

              <p className="text-gray-600 text-xs mt-2">
                GAME DOCK Management Account
              </p>
            </div>

            {/* STATUS */}

            <div className="sm:text-right">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium sm:justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Active Account
              </div>

              <p className="text-gray-600 text-xs mt-2">
                Account Settings
              </p>
            </div>

          </div>

        </div>

        {/* PERSONAL INFORMATION */}

        <div className={sectionClass}>

          <div className="flex items-center gap-3 mb-7">

            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <User size={19} className="text-purple-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Personal Information
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Update your personal account details.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* NAME */}

            <div>
              <label className={labelClass}>
                Full Name
              </label>

              <div className="relative">
                <User size={17} className={iconClass} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className={labelClass}>
                Email Address
              </label>

              <div className="relative">
                <Mail size={17} className={iconClass} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* PHONE */}

            <div>
              <label className={labelClass}>
                Phone Number
              </label>

              <div className="relative">
                <Phone size={17} className={iconClass} />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClass}
                />
              </div>
            </div>

          </div>

        </div>

        {/* SECURITY SETTINGS */}

        <div className={sectionClass}>

          <div className="flex items-center gap-3 mb-7">

            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
              <Lock size={19} className="text-purple-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Security Settings
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Manage your account password.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CURRENT PASSWORD */}

            <div>
              <label className={labelClass}>
                Current Password
              </label>

              <div className="relative">
                <Lock size={17} className={iconClass} />

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`${inputClass} pr-12`}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}

            <div>
              <label className={labelClass}>
                New Password
              </label>

              <div className="relative">
                <Lock size={17} className={iconClass} />

                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showNewPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="md:col-span-2">
              <label className={labelClass}>
                Confirm New Password
              </label>

              <div className="relative">
                <Lock size={17} className={iconClass} />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

          </div>

          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <p className="text-gray-500 text-xs">
              Leave all password fields empty if you don't want to change your password.
            </p>
          </div>

        </div>

        {/* SAVE BUTTON */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-purple-900/20"
          >
            <Save size={17} />

            {loading ? "Saving Changes..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AdminProfile;