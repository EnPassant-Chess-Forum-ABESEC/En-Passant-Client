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

  if (loading) return <div className="p-12 text-center text-white/40 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="space-y-12">
      {/* ─── Department Form ─── */}
      <form onSubmit={handleSave} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b1a1a]/50 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">
            {editId ? 'Edit Department' : 'Create Department'}
          </h2>
          {editId && (
            <button type="button" onClick={() => {setEditId(null); setName(""); setCode(""); setDescription("");}} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Name</label>
            <input required value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Media & Videography" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Code</label>
            <input required value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. MEDIA" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Description</label>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Brief description of the department's role..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20" />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
          <button type="submit" className="w-full lg:w-auto bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {editId ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </form>

      {/* ─── Department List Table ─── */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#050505] text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal">Dept ID</th>
                <th className="px-6 py-4 font-normal">Code</th>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Description</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {departments.length === 0 && (
                <tr><td colSpan="5" className="p-12 text-center text-white/40 uppercase tracking-widest text-xs">No departments found</td></tr>
              )}
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 font-mono text-sm text-white/40">{dept._id}</td>
                  <td className="px-6 py-5 font-mono text-xs text-[#9b1a1a] font-bold tracking-wider">{dept.code}</td>
                  <td className="px-6 py-5 font-bold tracking-wide">{dept.name}</td>
                  <td className="px-6 py-5 text-xs text-white/60">{dept.description}</td>
                  <td className="px-6 py-5 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(dept)} className="text-[10px] uppercase font-bold text-white/40 hover:text-white tracking-widest transition-colors">Edit</button>
                    <button onClick={() => handleDelete(dept._id)} className="text-[10px] uppercase font-bold text-red-500/60 hover:text-red-500 tracking-widest transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
