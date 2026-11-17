import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  UserRound,
  Mail,
  ShieldCheck,
  Package,
  ArrowLeft,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  // PROTECT PROFILE PAGE
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#100E1B] text-white pt-28 px-4 pb-12">

      <div className="max-w-3xl mx-auto">

        {/* BACK BUTTON */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* PAGE HEADING */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            View your GAME DOCK account information.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-[#171426] border border-[#30283F] rounded-2xl overflow-hidden">

          {/* PROFILE HEADER */}
          <div className="p-8 flex flex-col sm:flex-row items-center gap-5 border-b border-[#30283F]">

            <div className="w-20 h-20 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <UserRound size={38} className="text-purple-400" />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {user.name || "User"}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                GAME DOCK Member
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 text-green-400 text-xs">
                <ShieldCheck size={15} />
                Active Account
              </div>
            </div>

          </div>

          {/* ACCOUNT INFORMATION */}
          <div className="p-6 sm:p-8">

            <h3 className="text-lg font-semibold mb-6">
              Account Information
            </h3>

            <div className="space-y-5">

              {/* NAME */}
              <div className="flex items-center gap-4 p-4 bg-[#100E1B] rounded-xl border border-[#30283F]">

                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <UserRound size={20} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    Full Name
                  </p>

                  <p className="text-white text-sm font-medium">
                    {user.name || "Not available"}
                  </p>
                </div>

              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-4 p-4 bg-[#100E1B] rounded-xl border border-[#30283F]">

                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <Mail size={20} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    Email Address
                  </p>

                  <p className="text-white text-sm font-medium break-all">
                    {user.email || "Not available"}
                  </p>
                </div>

              </div>

              {/* USER ID */}
              <div className="flex items-center gap-4 p-4 bg-[#100E1B] rounded-xl border border-[#30283F]">

                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    Account ID
                  </p>

                  <p className="text-white text-sm font-medium">
                    {user.id || "Not available"}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* MY ORDERS BUTTON */}
          <div className="px-6 sm:px-8 pb-8">

            <Link
              to="/my-orders"
              className="flex items-center justify-between w-full bg-purple-600 hover:bg-purple-700 rounded-xl px-5 py-4 transition"
            >
              <div className="flex items-center gap-3">
                <Package size={20} />

                <span className="font-semibold text-sm">
                  View My Orders
                </span>
              </div>

              <span>→</span>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;