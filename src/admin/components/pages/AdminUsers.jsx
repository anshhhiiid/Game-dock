import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchAdminUsers,
  changeUserStatus,
} from "../../../redux/slices/adminSlice";

import {
  Search,
  Ban,
  CheckCircle,
  Users,
} from "lucide-react";

const AdminUsers = () => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (user) => {
    const newStatus = !user.isBlocked;

    try {
      await dispatch(
        changeUserStatus({
          id: user.id,
          isBlocked: newStatus,
        })
      ).unwrap();

      toast.success(
        newStatus
          ? "User blocked successfully"
          : "User unblocked successfully"
      );
    } catch (error) {
      toast.error(error || "Failed to update user status");
    }
  };

  return (
    <div className="p-5 md:p-8 text-white">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Users
        </h1>

        <p className="text-gray-400 mt-2">
          Manage registered GAME DOCK customers.
        </p>

      </div>

      {/* USER COUNT */}

      <div className="bg-[#151b27] border border-gray-800 p-5 rounded-xl mb-6 flex items-center gap-4">

        <div className="bg-red-500/10 p-3 rounded-lg">
          <Users className="text-red-500" size={25} />
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Total Registered Users
          </p>

          <h2 className="text-2xl font-bold">
            {users.length}
          </h2>
        </div>

      </div>

      {/* SEARCH */}

      <div className="relative mb-6 max-w-md">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={20}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search users..."
          className="w-full bg-[#151b27] border border-gray-700 rounded-lg pl-11 pr-4 py-3 outline-none focus:border-red-500"
        />

      </div>

      {/* USER TABLE */}

      <div className="bg-[#151b27] border border-gray-800 rounded-xl overflow-hidden">

        {loading ? (

          <p className="p-10 text-center text-gray-400">
            Loading users...
          </p>

        ) : filteredUsers.length === 0 ? (

          <p className="p-10 text-center text-gray-400">
            No users found.
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px] text-left">

              <thead className="bg-[#0d121d] text-gray-400 text-sm">

                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>

              </thead>

              <tbody>

                {displayedUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-t border-gray-800 hover:bg-white/5"
                  >

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <span className="font-medium">
                          {user.name || "Unknown"}
                        </span>

                      </div>

                    </td>

                    <td className="p-4 text-gray-300">
                      {user.email}
                    </td>

                    <td className="p-4">

                      <span
                        className={
                          user.isBlocked
                            ? "bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs"
                            : "bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs"
                        }
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>

                    </td>

                    <td className="p-4">

                      <button
                        onClick={() => handleStatusChange(user)}
                        className={
                          user.isBlocked
                            ? "flex items-center gap-2 text-green-400 hover:text-green-300"
                            : "flex items-center gap-2 text-red-400 hover:text-red-300"
                        }
                      >

                        {user.isBlocked ? (
                          <>
                            <CheckCircle size={18} />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={18} />
                            Block
                          </>
                        )}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-4 mt-6">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="px-4 py-2 bg-[#151b27] rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="px-4 py-2 bg-[#151b27] rounded disabled:opacity-40"
          >
            Next
          </button>

        </div>

      )}

    </div>
  );
};

export default AdminUsers;