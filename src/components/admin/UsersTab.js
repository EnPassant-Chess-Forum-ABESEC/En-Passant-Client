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

  if (loading) return <div className="p-8 text-center text-white/40 uppercase">Loading...</div>;

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
          <tr>
            <th className="p-4 font-normal">User ID</th>
            <th className="p-4 font-normal">Name</th>
            <th className="p-4 font-normal">Email</th>
            <th className="p-4 font-normal">Role</th>
            <th className="p-4 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white">
          {users.length === 0 ? (
            <tr><td colSpan="5" className="p-8 text-center text-white/40 uppercase">No users found</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="hover:bg-white/5 transition">
                <td className="p-4 font-mono text-xs text-white/50">{user._id}</td>
                <td className="p-4 font-bold">{user.userName}</td>
                <td className="p-4 text-sm text-white/70">{user.collegeEmail}</td>
                <td className="p-4 font-mono text-xs text-[#9b1a1a] font-bold">{user.role}</td>
                <td className="p-4 text-right">
                  <select 
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                    value={user.role}
                    className="bg-[#222] border border-white/20 p-1 text-xs text-white focus:outline-none"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
