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

  if (loading) return <div className="p-12 text-center text-white/40 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="space-y-12">
      {/* ─── Task Form ─── */}
      <form onSubmit={handleSave} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9b1a1a]/50 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">
            {editId ? 'Edit Task' : 'Create New Task'}
          </h2>
          {editId && (
            <button type="button" onClick={resetForm} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Department</label>
            <select 
              value={departmentId} 
              onChange={e=>setDepartmentId(e.target.value)} 
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none appearance-none"
            >
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Title</label>
            <input 
              required 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="e.g. Write an Instagram Caption"
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20" 
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Summary</label>
            <textarea 
              required 
              value={summary} 
              onChange={e=>setSummary(e.target.value)} 
              placeholder="Brief description of what needs to be done..."
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20 resize-none" 
              rows="2"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Instructions (One per line)</label>
            <textarea 
              required 
              value={instructions} 
              onChange={e=>setInstructions(e.target.value)} 
              placeholder="1. Read the guidelines\n2. Draft the caption\n3. Submit for review"
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#9b1a1a] focus:ring-1 focus:ring-[#9b1a1a] transition-all outline-none placeholder:text-white/20 resize-none font-mono" 
              rows="4"
            />
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <label className="group flex items-center gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isRequired ? 'bg-[#9b1a1a] border-transparent' : 'bg-transparent border border-white/20 group-hover:border-white/50'}`}>
                {isRequired && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" checked={isRequired} onChange={e=>setIsRequired(e.target.checked)} className="hidden" />
              <span className="text-xs uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Required Task</span>
            </label>
            
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Accepts:</span>
              
              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsText ? 'bg-[#9b1a1a] border-transparent' : 'bg-transparent border border-white/20'}`}>
                  {acceptsText && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsText} onChange={e=>setAcceptsText(e.target.checked)} className="hidden" />
                <span className="text-xs uppercase tracking-widest text-white/60">Text</span>
              </label>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsLinks ? 'bg-[#9b1a1a] border-transparent' : 'bg-transparent border border-white/20'}`}>
                  {acceptsLinks && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsLinks} onChange={e=>setAcceptsLinks(e.target.checked)} className="hidden" />
                <span className="text-xs uppercase tracking-widest text-white/60">Links</span>
              </label>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsFiles ? 'bg-[#9b1a1a] border-transparent' : 'bg-transparent border border-white/20'}`}>
                  {acceptsFiles && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsFiles} onChange={e=>setAcceptsFiles(e.target.checked)} className="hidden" />
                <span className="text-xs uppercase tracking-widest text-white/60">Files</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full lg:w-auto bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {editId ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>

      {/* ─── Task List Table ─── */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#050505] text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-normal w-16 text-center">Ord</th>
                <th className="px-6 py-4 font-normal">Department</th>
                <th className="px-6 py-4 font-normal">Title</th>
                <th className="px-6 py-4 font-normal">Accepts</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {tasks.length === 0 && (
                <tr><td colSpan="5" className="p-12 text-center text-white/40 uppercase tracking-widest text-xs">No tasks found</td></tr>
              )}
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 text-center text-white/40 font-mono text-sm">{task.order}</td>
                  <td className="px-6 py-5 text-xs text-white/70 uppercase tracking-wider">{task.departmentId?.name || task.departmentId}</td>
                  <td className="px-6 py-5 font-bold text-white tracking-wide">{task.title}</td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {task.submission?.acceptsText && <span className="bg-white/5 border border-white/10 text-white/60 rounded px-2 py-1 text-[10px] uppercase tracking-widest">TXT</span>}
                      {task.submission?.acceptsLinks && <span className="bg-white/5 border border-white/10 text-white/60 rounded px-2 py-1 text-[10px] uppercase tracking-widest">LNK</span>}
                      {task.submission?.acceptsFiles && <span className="bg-white/5 border border-white/10 text-white/60 rounded px-2 py-1 text-[10px] uppercase tracking-widest">FILE</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(task)} className="text-[10px] uppercase font-bold text-white/40 hover:text-white tracking-widest transition-colors">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="text-[10px] uppercase font-bold text-red-500/60 hover:text-red-500 tracking-widest transition-colors">Delete</button>
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
