import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminSearchBar from "./AdminSearchBar";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function UsersTab() {
  const fetchApi = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortFilter, setSortFilter] = useState("NEWEST");

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (user._id || "").toLowerCase().includes(q) ||
        (user.userName || "").toLowerCase().includes(q) ||
        (user.email || "").toLowerCase().includes(q);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    if (sortFilter === "NEWEST") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortFilter === "OLDEST") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [users, searchQuery, roleFilter, sortFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, sortFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Total pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/users?pageSize=1000");
      setUsers(res.users || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  }

  const updateUserRole = async (id, newRole) => {
    try {
      await fetchApi(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: { role: newRole },
      });
      toast.success("Role updated successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        <span>Loading Data...</span>
      </div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <AdminSearchBar
          onRefresh={loadData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={roleFilter}
          setStatusFilter={setRoleFilter}
          statusOptions={[
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ]}
          sortFilter={sortFilter}
          setSortFilter={setSortFilter}
          sortOptions={[
            { label: "Newest First", value: "NEWEST" },
            { label: "Oldest First", value: "OLDEST" },
          ]}
          totalCount={filteredUsers.length}
          countLabel="Total Users"
        />
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="hidden md:table w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-normal">User ID</th>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Role</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200"
            >
              {paginatedUsers.length === 0 ? (
                <motion.tr variants={itemVariants}>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs"
                  >
                    No users found
                  </td>
                </motion.tr>
              ) : (
                paginatedUsers.map((user) => (
                  <motion.tr
                    variants={itemVariants}
                    key={user._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-5 font-mono text-sm text-slate-500 dark:text-slate-400">
                      {user._id}
                    </td>
                    <td className="px-6 py-5 font-bold tracking-wide text-slate-900 dark:text-slate-50">
                      {user.userName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-5 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">
                      {user.role}
                    </td>
                    <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <Select
                        value={user.role}
                        onValueChange={(val) =>
                          updateUserRole(user.clerkId, val)
                        }
                      >
                        <SelectTrigger className="w-28 text-[10px] font-bold uppercase tracking-wider h-8 bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 ml-auto">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          <SelectItem
                            value="user"
                            className="text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800/50"
                          >
                            USER
                          </SelectItem>
                          <SelectItem
                            value="admin"
                            className="text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800/50"
                          >
                            ADMIN
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
          <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
            {paginatedUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">
                No users found
              </div>
            ) : (
              paginatedUsers.map((user) => (
                <div key={user._id} className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col min-w-0 pr-4">
                      <span className="font-bold tracking-wide text-slate-900 dark:text-slate-50 truncate">
                        {user.userName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-1">
                        {user.email}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase px-2 py-1 rounded shrink-0">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Change Role
                    </span>
                    <Select
                      value={user.role}
                      onValueChange={(val) => updateUserRole(user.clerkId, val)}
                    >
                      <SelectTrigger className="w-full text-xs font-bold uppercase tracking-wider h-10 bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                        <SelectItem
                          value="user"
                          className="text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          USER
                        </SelectItem>
                        <SelectItem
                          value="admin"
                          className="text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                          ADMIN
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-[#020617]">
            <span className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
