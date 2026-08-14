import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersTab() {
  const fetchApi = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/users?pageSize=50");
      setUsers(res.users || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const updateUserRole = async (id, newRole) => {
    try {
      await fetchApi(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: { role: newRole }
      });
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-normal">User ID</th>
              <th className="px-6 py-4 font-normal">Name</th>
              <th className="px-6 py-4 font-normal">Email</th>
              <th className="px-6 py-4 font-normal">Role</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200">
            {users.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5 font-mono text-sm text-slate-500 dark:text-slate-400">{user._id}</td>
                  <td className="px-6 py-5 font-bold tracking-wide text-slate-900 dark:text-slate-50">{user.userName}</td>
                  <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-6 py-5 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">{user.role}</td>
                  <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Select
                      value={user.role}
                      onValueChange={(val) => updateUserRole(user._id, val)}
                    >
                      <SelectTrigger className="w-28 text-[10px] font-bold uppercase tracking-wider h-8 bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 ml-auto">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                        <SelectItem value="user" className="text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800/50">USER</SelectItem>
                        <SelectItem value="admin" className="text-[10px] font-bold uppercase tracking-wider cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800/50">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
