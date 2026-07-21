import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function DepartmentsTab() {
  const fetchApi = useApi();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/departments");
      setDepartments(res.departments || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetchApi(`/admin/departments/${editId}`, {
          method: "PUT",
          body: { name, code, description }
        });
      } else {
        await fetchApi("/admin/departments", {
          method: "POST",
          body: { name, code, description }
        });
      }
      setName(""); setCode(""); setDescription(""); setEditId(null);
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (dept) => {
    setEditId(dept._id);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await fetchApi(`/admin/departments/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-white/40 uppercase">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSave} className="bg-[#1a1a1a] border border-white/10 p-6 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs uppercase text-white/50 mb-1">Name</label>
          <input required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white" />
        </div>
        <div className="flex-1">
          <label className="block text-xs uppercase text-white/50 mb-1">Code</label>
          <input required value={code} onChange={e=>setCode(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white" />
        </div>
        <div className="flex-2 w-full md:w-1/3">
          <label className="block text-xs uppercase text-white/50 mb-1">Description</label>
          <input value={description} onChange={e=>setDescription(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white" />
        </div>
        <div className="flex gap-2">
          {editId && <button type="button" onClick={() => {setEditId(null); setName(""); setCode(""); setDescription("");}} className="bg-white/10 px-4 py-2 text-sm uppercase">Cancel</button>}
          <button type="submit" className="bg-[#9b1a1a] px-4 py-2 text-sm font-bold uppercase">{editId ? 'Update' : 'Create'}</button>
        </div>
      </form>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4 font-normal">Dept ID</th>
              <th className="p-4 font-normal">Code</th>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Description</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-white/5 transition">
                <td className="p-4 font-mono text-xs text-white/50">{dept._id}</td>
                <td className="p-4 font-mono text-[#9b1a1a] font-bold">{dept.code}</td>
                <td className="p-4">{dept.name}</td>
                <td className="p-4 text-sm text-white/70">{dept.description}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(dept)} className="text-xs uppercase text-white/50 hover:text-white">Edit</button>
                  <button onClick={() => handleDelete(dept._id)} className="text-xs uppercase text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
