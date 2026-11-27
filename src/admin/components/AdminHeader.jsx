import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { adminLogout } from "../../redux/slices/adminAuthSlice";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const admin = useSelector((state) => state.adminAuth.admin);

  // PAGE TITLES

  const pageTitles = {
    "/admin/profile": "Admin Profile",
    "/admin/dashboard": "Dashboard",
    "/admin/products": "Products & Games",
    "/admin/users": "Users Management",
    "/admin/orders": "Orders Management",
  };

  const currentPage =
    pageTitles[location.pathname] || "Admin Panel";

  // ADMIN INITIAL

  const initial =
    admin?.name?.trim()?.charAt(0)?.toUpperCase() || "A";

  // ADMIN LOGOUT

  const handleLogout = () => {
    dispatch(adminLogout());

    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.07] bg-[#151519] px-5 md:px-8 py-4 text-white">

      {/* LEFT SECTION */}

      <div>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          {currentPage}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Manage your GAME DOCK store
        </p>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex items-center gap-3 md:gap-6">

        {/* ADMIN INFORMATION */}

        <div className="flex items-center gap-3">

          {/* AVATAR */}

          <div className="w-10 h-10 rounded-xl bg-[#22202B] border border-purple-500/20 flex items-center justify-center shrink-0">
            <span className="text-purple-300 font-bold text-sm">
              {initial}
            </span>
          </div>

          {/* ADMIN DETAILS */}

          <div className="hidden sm:block">

            <p className="text-sm font-semibold text-white">
              {admin?.name || "Administrator"}
            </p>

            <div className="flex items-center gap-1.5 mt-1">

              <ShieldCheck
                size={12}
                className="text-purple-400"
              />

              <span className="text-[11px] text-gray-500">
                Administrator
              </span>

            </div>

            {admin?.email && (
              <p className="text-[10px] text-gray-600 mt-0.5">
                {admin.email}
              </p>
            )}

          </div>

        </div>

        {/* LOGOUT BUTTON */}

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.06] px-3 md:px-4 py-2.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/[0.14] hover:border-red-500/20"
        >
          <LogOut size={16} />

          <span className="hidden md:inline">
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}

export default AdminHeader;