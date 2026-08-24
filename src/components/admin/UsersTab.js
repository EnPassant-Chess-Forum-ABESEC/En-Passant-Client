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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminSearchBar from "./AdminSearchBar";
import { motion } from "framer-motion";
import {
  User,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Trash2,
} from "lucide-react";

function timeAgo(dateString) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 7) return `${days} days ago`;
  return `${weeks} weeks ago`;
}

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

  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);

  const executeDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    const id = confirmDeleteUser;
    setConfirmDeleteUser(null);

    try {
      await fetchApi(`/admin/users/${id}`, {
        method: "DELETE",
      });
      toast.success("User deleted successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
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
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedUsers.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] rounded-2xl">
              No users found
            </div>
          ) : (
            paginatedUsers.map((user) => {
              const relativeTime = timeAgo(user.createdAt);
              const isMissingCollegeEmail = !user.collegeEmail;
              const isMissingPhone = !user.phoneNumber;
              const isMissingBranch = !user.branch;

              return (
                <motion.div
                  variants={itemVariants}
                  key={user._id}
                  className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative flex flex-col gap-5 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                      <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="font-bold text-slate-900 dark:text-slate-50 text-lg truncate"
                          title={user.userName}
                        >
                          {user.userName}
                        </h3>
                        <Select
                          value={user.role}
                          onValueChange={(val) =>
                            updateUserRole(user.clerkId, val)
                          }
                        >
                          <SelectTrigger className="w-20 h-7 px-2 shrink-0 text-[9px] font-black uppercase tracking-wider bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 focus:ring-0">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 min-w-0">
                            <SelectItem
                              value="user"
                              className="text-[9px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50"
                            >
                              USER
                            </SelectItem>
                            <SelectItem
                              value="admin"
                              className="text-[9px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50"
                            >
                              ADMIN
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p
                        className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-slate-50 dark:bg-[#020617] rounded-2xl p-4 border border-slate-100 dark:border-slate-800/50 mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        Phone
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {user.phoneNumber || (
                          <span className="text-slate-400 dark:text-slate-500">
                            -
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        Academics
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {user.branch ? (
                          `${user.branch} (Yr ${user.year || "1"})`
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">
                            -
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        College Email
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate font-mono">
                        {user.collegeEmail || (
                          <span className="text-slate-400 dark:text-slate-500 font-sans">
                            -
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-2">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Joined {relativeTime}
                    </span>
                    <button
                      onClick={() => setConfirmDeleteUser(user.clerkId)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex flex-row items-center justify-between mt-6 px-6 py-4 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-wider">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
      <AlertDialog
        open={!!confirmDeleteUser}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteUser(null);
        }}
      >
        <AlertDialogContent className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-50 font-bold">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this user? This action will
              permanently remove their account from Clerk and the database. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteUser}
              className="rounded-xl text-white bg-rose-600 hover:bg-rose-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
