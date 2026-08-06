import { useState, useEffect, useMemo, Fragment } from "react";
import { Edit2, Trash2, GripVertical, User } from "lucide-react";
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
import { toast } from "sonner";
import { useApi } from "@/lib/api";

export default function TasksTab() {
  const fetchApi = useApi();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

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
      const loadedDepts = deptsRes.departments || [];
      setDepartments(loadedDepts);
      if (loadedDepts.length > 0) {
        if (!departmentId) setDepartmentId(loadedDepts[0]._id);
        if (!activeTab) setActiveTab(loadedDepts[0]._id);
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
        await fetchApi(`/admin/tasks/${editId}`, { method: "PATCH", body: payload });
        toast.success("Task updated successfully!");
      } else {
        await fetchApi("/admin/tasks", { method: "POST", body: payload });
        toast.success("Task created successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Error saving: " + err.message);
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

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    try {
      await fetchApi(`/admin/tasks/${deletingId}`, { method: "DELETE" });
      toast.success("Task deleted successfully!");
      loadData();
    } catch (err) {
      toast.error("Error deleting: " + err.message);
    } finally {
      setDeletingId(null);
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

  const activeTasks = useMemo(() => {
    if (!activeTab) return [];
    return tasks
      .filter(t => (t.departmentId?._id || t.departmentId) === activeTab)
      .sort((a, b) => a.order - b.order);
  }, [tasks, activeTab]);

  if (loading) return <div className="p-12 text-center text-slate-500 uppercase tracking-widest text-sm">Loading Data...</div>;

  return (
    <div className="space-y-12">
      {/* ─── Task Form ─── */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold  tracking-tight text-slate-800">
            {editId ? 'Edit Task' : 'Create New Task'}
          </h2>
          {editId && (
            <button type="button" onClick={resetForm} className="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-normal text-slate-500">Department</label>
            <Select value={departmentId || undefined} onValueChange={setDepartmentId}>
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl h-[46px] text-sm font-semibold text-slate-700 focus:ring-blue-500">
                <SelectValue placeholder="Select Department">
                  {departments.find(d => d._id.toString() === (departmentId || "").toString())?.name || "Select Department"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-800">
                {departments.map(d => (
                  <SelectItem key={d._id} value={d._id.toString()} className="font-semibold text-sm focus:bg-slate-100 focus:text-slate-900">
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-normal text-slate-500">Title</label>
            <input 
              required 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="e.g. Write an Instagram Caption"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-800/20" 
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold tracking-normal text-slate-500">Summary</label>
            <textarea 
              required 
              value={summary} 
              onChange={e=>setSummary(e.target.value)} 
              placeholder="Brief description of what needs to be done..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-800/20 resize-none" 
              rows="2"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold tracking-normal text-slate-500">Instructions (One per line)</label>
            <textarea 
              required 
              value={instructions} 
              onChange={e=>setInstructions(e.target.value)} 
              placeholder="1. Read the guidelines\n2. Draft the caption\n3. Submit for review"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-800/20 resize-none font-mono" 
              rows="4"
            />
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <label className="group flex items-center gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isRequired ? 'bg-blue-600 border-transparent' : 'bg-transparent border border-slate-300 group-hover:border-slate-400'}`}>
                {isRequired && <span className="text-white text-xs">✓</span>}
              </div>
              <input type="checkbox" checked={isRequired} onChange={e=>setIsRequired(e.target.checked)} className="hidden" />
              <span className="text-xs tracking-tight text-slate-600 group-hover:text-slate-800 transition-colors">Required Task</span>
            </label>
            
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold tracking-normal text-slate-500">Accepts:</span>
              
              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsText ? 'bg-blue-600 border-transparent' : 'bg-transparent border border-slate-300'}`}>
                  {acceptsText && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsText} onChange={e=>setAcceptsText(e.target.checked)} className="hidden" />
                <span className="text-xs tracking-tight text-slate-500">Text</span>
              </label>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsLinks ? 'bg-blue-600 border-transparent' : 'bg-transparent border border-slate-300'}`}>
                  {acceptsLinks && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsLinks} onChange={e=>setAcceptsLinks(e.target.checked)} className="hidden" />
                <span className="text-xs tracking-tight text-slate-500">Links</span>
              </label>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsFiles ? 'bg-blue-600 border-transparent' : 'bg-transparent border border-slate-300'}`}>
                  {acceptsFiles && <span className="text-white text-[10px]">✓</span>}
                </div>
                <input type="checkbox" checked={acceptsFiles} onChange={e=>setAcceptsFiles(e.target.checked)} className="hidden" />
                <span className="text-xs tracking-tight text-slate-500">Files</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full lg:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-xs font-bold tracking-tight transition-all transform hover:scale-105 shadow-md"
          >
            {editId ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>

      {/* ─── Department Tabs & Task List Table ─── */}
      <div className="space-y-6">
        {/* Horizontal Department Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {departments.map((dept) => (
            <button
              key={dept._id}
              onClick={() => setActiveTab(dept._id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all ${
                activeTab === dept._id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-normal w-16 text-center">Ord</th>
                  <th className="px-6 py-4 font-normal">Title</th>
                  <th className="px-6 py-4 font-normal">Accepts</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-800">
                {activeTasks.length === 0 ? (
                  <tr><td colSpan="4" className="p-12 text-center text-slate-500 uppercase tracking-widest text-xs">No tasks found for this department</td></tr>
                ) : (
                  activeTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5 text-center text-slate-500 font-mono text-sm">{task.order}</td>
                      <td className="px-6 py-5 font-bold text-slate-800 tracking-wide">{task.title}</td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          {task.submission?.acceptsText && <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded px-2 py-1 text-[10px]  tracking-widest">TXT</span>}
                          {task.submission?.acceptsLinks && <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded px-2 py-1 text-[10px]  tracking-widest">LNK</span>}
                          {task.submission?.acceptsFiles && <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded px-2 py-1 text-[10px]  tracking-widest">FILE</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleEdit(task)} 
                            title="Edit Task"
                            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(task._id)} 
                            title="Delete Task"
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
