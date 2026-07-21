import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function TasksTab() {
  const fetchApi = useApi();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editId, setEditId] = useState(null);
  const [departmentId, setDepartmentId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [instructions, setInstructions] = useState("");
  const [order, setOrder] = useState(1);
  const [isRequired, setIsRequired] = useState(true);
  const [acceptsText, setAcceptsText] = useState(false);
  const [acceptsLinks, setAcceptsLinks] = useState(false);
  const [acceptsFiles, setAcceptsFiles] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, deptsRes] = await Promise.all([
        fetchApi("/tasks?year=2026"), // Admin should fetch for specific year or all
        fetchApi("/admin/departments")
      ]);
      setTasks(tasksRes.tasks || []);
      setDepartments(deptsRes.departments || []);
      if (deptsRes.departments?.length > 0 && !departmentId) {
        setDepartmentId(deptsRes.departments[0]._id);
      }
    } catch (err) {
      alert("Error loading data: " + err.message);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        departmentId,
        year: parseInt(year),
        title,
        summary,
        instructions: instructions.split('\n').filter(i => i.trim() !== ""),
        order: parseInt(order),
        isRequired,
        submission: {
          acceptsText,
          acceptsLinks,
          acceptsFiles,
          ...(acceptsFiles ? { fileCategory: "image", maxFiles: 5, maxFileSize: 5242880 } : {})
        }
      };

      if (editId) {
        await fetchApi(`/admin/tasks/${editId}`, { method: "PUT", body: payload });
      } else {
        await fetchApi("/admin/tasks", { method: "POST", body: payload });
      }
      resetForm();
      loadData();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setDepartmentId(task.departmentId._id || task.departmentId);
    setYear(task.year);
    setTitle(task.title);
    setSummary(task.summary);
    setInstructions(Array.isArray(task.instructions) ? task.instructions.join('\n') : task.instructions);
    setOrder(task.order);
    setIsRequired(task.isRequired);
    setAcceptsText(task.submission?.acceptsText || false);
    setAcceptsLinks(task.submission?.acceptsLinks || false);
    setAcceptsFiles(task.submission?.acceptsFiles || false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetchApi(`/admin/tasks/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setSummary("");
    setInstructions("");
    setOrder(1);
    setIsRequired(true);
    setAcceptsText(false);
    setAcceptsLinks(false);
    setAcceptsFiles(false);
  };

  if (loading) return <div className="p-8 text-center text-white/40 uppercase">Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSave} className="bg-[#1a1a1a] border border-white/10 p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">Department</label>
            <select value={departmentId} onChange={e=>setDepartmentId(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white focus:border-[#9b1a1a] focus:outline-none">
              {departments.map(d => <option key={d._id} value={d._id}>{d.name} ({d.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1">Title</label>
            <input required value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white focus:border-[#9b1a1a] focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-white/50 mb-1">Summary</label>
            <textarea required value={summary} onChange={e=>setSummary(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white focus:border-[#9b1a1a] focus:outline-none" rows="2"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-white/50 mb-1">Instructions (One per line)</label>
            <textarea required value={instructions} onChange={e=>setInstructions(e.target.value)} className="w-full bg-[#222] border border-white/20 p-2 text-sm text-white focus:border-[#9b1a1a] focus:outline-none" rows="3"></textarea>
          </div>
        </div>

        <div className="flex gap-6 items-center bg-white/5 p-4 border border-white/10">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={isRequired} onChange={e=>setIsRequired(e.target.checked)} className="accent-[#9b1a1a]" />
            Required Task
          </label>
          <div className="h-4 w-px bg-white/20"></div>
          <span className="text-xs uppercase tracking-widest text-white/50">Accepts:</span>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={acceptsText} onChange={e=>setAcceptsText(e.target.checked)} className="accent-[#9b1a1a]" />
            Text
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={acceptsLinks} onChange={e=>setAcceptsLinks(e.target.checked)} className="accent-[#9b1a1a]" />
            Links
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={acceptsFiles} onChange={e=>setAcceptsFiles(e.target.checked)} className="accent-[#9b1a1a]" />
            Files
          </label>
          <div className="flex-1 text-right space-x-2">
            {editId && <button type="button" onClick={resetForm} className="bg-white/10 px-4 py-2 text-sm uppercase">Cancel</button>}
            <button type="submit" className="bg-[#9b1a1a] px-6 py-2 text-sm font-bold uppercase tracking-widest">{editId ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </form>

      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
            <tr>
              <th className="p-4 font-normal w-12">Ord</th>
              <th className="p-4 font-normal">Department</th>
              <th className="p-4 font-normal">Title</th>
              <th className="p-4 font-normal">Accepts</th>
              <th className="p-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {tasks.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-white/40 uppercase">No tasks found</td></tr>
            )}
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-white/5 transition">
                <td className="p-4 text-center text-white/50">{task.order}</td>
                <td className="p-4 text-xs font-mono">{task.departmentId?.name || task.departmentId}</td>
                <td className="p-4 font-bold">{task.title}</td>
                <td className="p-4 text-xs font-mono text-white/60">
                  {task.submission?.acceptsText && <span className="bg-white/10 px-2 py-1 mr-1">TXT</span>}
                  {task.submission?.acceptsLinks && <span className="bg-white/10 px-2 py-1 mr-1">LNK</span>}
                  {task.submission?.acceptsFiles && <span className="bg-white/10 px-2 py-1 mr-1">FILE</span>}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleEdit(task)} className="text-xs uppercase text-white/50 hover:text-white">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="text-xs uppercase text-red-500 hover:text-red-400">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
