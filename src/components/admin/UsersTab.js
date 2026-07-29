import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

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

  if (loading) return <div className="p-12 text-center text-white/40 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-[#050505] text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-normal">User ID</th>
              <th className="px-6 py-4 font-normal">Name</th>
              <th className="px-6 py-4 font-normal">Email</th>
              <th className="px-6 py-4 font-normal">Role</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {users.length === 0 ? (
              <tr><td colSpan="5" className="p-12 text-center text-white/40 uppercase tracking-widest text-xs">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 font-mono text-sm text-white/40">{user._id}</td>
                  <td className="px-6 py-5 font-bold tracking-wide">{user.userName}</td>
                  <td className="px-6 py-5 text-sm text-white/70">{user.collegeEmail}</td>
                  <td className="px-6 py-5 font-mono text-xs text-[#9b1a1a] font-bold tracking-wider uppercase">{user.role}</td>
                  <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <select 
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      value={user.role}
                      className="bg-transparent border-b border-white/20 py-1 text-[10px] uppercase font-bold text-white/70 focus:outline-none focus:border-[#9b1a1a] cursor-pointer"
                    >
                      <option value="user" className="bg-[#0a0a0a] text-white">USER</option>
                      <option value="admin" className="bg-[#0a0a0a] text-white">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
