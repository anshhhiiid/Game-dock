import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";

import { adminLogout } from "../../redux/slices/adminAuthSlice";

function AdminHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.adminAuth.admin);

  // ADMIN LOGOUT
  const handleLogout = () => {
    dispatch(adminLogout());

    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#11111b] px-8 py-5 text-white">

      {/* LEFT SECTION */}
      <div>
        <h2 className="text-xl font-semibold">
          Admin Dashboard
        </h2>

        <p className="text-sm text-gray-400">
          Manage your GAME DOCK store
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* ADMIN INFORMATION */}
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-purple-400" />

          <div>
            <p className="text-sm font-medium">
              {admin?.name || "Administrator"}
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition duration-300"
        >
          <LogOut size={17} />
          Logout
        </button>

      </div>

    </header>
  );
}

export default AdminHeader;