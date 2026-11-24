import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
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
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
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
    navigate("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#11111b] p-5 text-white">

      <div className="mb-10 flex items-center gap-3">
        <Gamepad2 className="text-purple-500" size={32} />

        <div>
          <h1 className="text-xl font-bold">
            GAME <span className="text-purple-500">DOCK</span>
          </h1>

          <p className="text-xs text-gray-400">
            Admin Panel
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;