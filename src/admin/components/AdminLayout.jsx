import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#09090f] text-white">

      <AdminSidebar />

      <div className="ml-64 min-h-screen">

        <AdminHeader />

        <main className="p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;