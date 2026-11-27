import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  UserCircle,
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
  Gamepad2,
} from "lucide-react";

import { adminLogout } from "../../redux/slices/adminAuthSlice";

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    {
      name: "Admin Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products & Games",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.07] bg-[#151519] p-5 text-white">

      {/* LOGO */}

      <div className="mb-10 flex items-center gap-3 px-1">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07]">
          <Gamepad2 className="text-purple-400" size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            GAME <span className="text-purple-400">DOCK</span>
          </h1>

          <p className="text-[11px] text-gray-500 mt-0.5 tracking-wider uppercase">
            Admin Panel
          </p>
        </div>

      </div>

      {/* NAVIGATION LABEL */}

      <div className="mb-3 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-600">
          Management
        </p>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-1.5">

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-500/[0.10] text-purple-300 border border-purple-500/[0.15]"
                    : "border border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >

              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-purple-400" />
                  )}

                  <Icon
                    size={19}
                    className={`transition-colors ${
                      isActive
                        ? "text-purple-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  />

                  <span>{link.name}</span>
                </>
              )}

            </NavLink>
          );
        })}

      </nav>

      {/* BOTTOM SECTION */}

      <div className="border-t border-white/[0.07] pt-5">

        <div className="mb-4 px-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 font-semibold">
            Account
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-red-500/10 hover:bg-red-500/[0.07] hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>

        <p className="text-center text-[10px] text-gray-700 mt-6">
          GAME DOCK © 2026
        </p>

      </div>

    </aside>
  );
}

export default AdminSidebar;