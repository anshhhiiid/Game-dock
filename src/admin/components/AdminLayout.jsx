import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#101014] text-white">

      <AdminSidebar />

      <div className="ml-64 min-h-screen flex flex-col">

        <AdminHeader />

        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;