import { useState, useEffect, useMemo, Fragment } from "react";
import { Edit2, Trash2, GripVertical, User, Loader2 } from "lucide-react";
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
import { motion } from "framer-motion";

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

export default function TasksTab() {
  const fetchApi = useApi();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
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
  const [maxLinks, setMaxLinks] = useState(1);
  const [maxFiles, setMaxFiles] = useState(1);
  const [fileCategory, setFileCategory] = useState("image");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tasksRes, deptsRes] = await Promise.all([
        fetchApi("/tasks?year=2026"),
        fetchApi("/admin/departments"),
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
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        departmentId,
        year: parseInt(year),
        title,
        summary,
        instructions: instructions.split("\n").filter((i) => i.trim() !== ""),
        order: parseInt(order),
        isRequired,
        submission: {
          acceptsText,
          acceptsLinks,
          acceptsFiles,
          ...(acceptsLinks ? { maxLinks: parseInt(maxLinks) } : {}),
          ...(acceptsFiles
            ? {
                fileCategory,
                maxFiles: parseInt(maxFiles),
                maxFileSize: 5242880,
              }
            : {}),
        },
      };

      if (editId) {
        await fetchApi(`/admin/tasks/${editId}`, {
          method: "PATCH",
          body: payload,
        });
        toast.success("Task updated successfully!");
      } else {
        await fetchApi("/admin/tasks", { method: "POST", body: payload });
        toast.success("Task created successfully!");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setDepartmentId(task.departmentId._id || task.departmentId);
    setYear(task.year);
    setTitle(task.title);
    setSummary(task.summary);
    setInstructions(
      Array.isArray(task.instructions)
        ? task.instructions.join("\n")
        : task.instructions,
    );
    setOrder(task.order);
    setIsRequired(task.isRequired);
    setAcceptsText(task.submission?.acceptsText || false);
    setAcceptsLinks(task.submission?.acceptsLinks || false);
    setAcceptsFiles(task.submission?.acceptsFiles || false);
    setMaxLinks(task.submission?.maxLinks || 1);
    setMaxFiles(task.submission?.maxFiles || 1);
    setFileCategory(task.submission?.fileCategory || "image");

    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setMaxLinks(1);
    setMaxFiles(1);
    setFileCategory("image");
  };

  const activeTasks = useMemo(() => {
    if (!activeTab) return [];
    return tasks
      .filter((t) => (t.departmentId?._id || t.departmentId) === activeTab)
      .sort((a, b) => a.order - b.order);
  }, [tasks, activeTab]);

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
      className="space-y-12"
    >
      <motion.form
        variants={itemVariants}
        onSubmit={handleSave}
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden transition-colors"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold  tracking-tight text-slate-800 dark:text-slate-50">
            {editId ? "Edit Task" : "Create New Task"}
          </h2>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">
                Department
              </label>
              <Select
                value={departmentId || undefined}
                onValueChange={setDepartmentId}
              >
                <SelectTrigger className="w-full bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-slate-800 rounded-xl h-[46px] text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-blue-500 dark:focus:ring-blue-500/50">
                  <SelectValue placeholder="Select Department">
                    {departments.find(
                      (d) =>
                        d._id.toString() === (departmentId || "").toString(),
                    )?.name || "Select Department"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                  {departments.map((d) => (
                    <SelectItem
                      key={d._id}
                      value={d._id.toString()}
                      className="font-semibold text-sm focus:bg-slate-100 dark:focus:bg-slate-800/50 focus:text-slate-900 dark:focus:text-slate-50"
                    >
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">
                Title
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Write an Instagram Caption"
                className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-800/20 dark:placeholder:text-slate-200/20"
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label className="block text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">
                Summary
              </label>
              <textarea
                required
                data-lenis-prevent="true"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of what needs to be done..."
                className="w-full flex-1 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-800/20 dark:placeholder:text-slate-200/20 resize-y min-h-[100px]"
                rows="4"
              />
            </div>
          </div>

          {/* Right Column (Instructions) */}
          <div className="lg:col-span-2 space-y-2 flex flex-col">
            <label className="block text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">
              Instructions (One per line)
            </label>
            <textarea
              required
              data-lenis-prevent="true"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="1. Read the guidelines\n2. Draft the caption\n3. Submit for review"
              className="w-full flex-1 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-800/20 dark:placeholder:text-slate-200/20 resize-y font-mono min-h-[250px]"
              rows="12"
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <label className="group flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isRequired ? "bg-blue-600 border-transparent" : "bg-transparent border border-slate-300 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-600"}`}
              >
                {isRequired && <span className="text-white text-xs">✓</span>}
              </div>
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="hidden"
              />
              <span className="text-xs tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                Required Task
              </span>
            </label>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold tracking-normal text-slate-500 dark:text-slate-400">
                Accepts:
              </span>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsText ? "bg-blue-600 border-transparent" : "bg-transparent border border-slate-300 dark:border-slate-700"}`}
                >
                  {acceptsText && (
                    <span className="text-white text-[10px]">✓</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={acceptsText}
                  onChange={(e) => setAcceptsText(e.target.checked)}
                  className="hidden"
                />
                <span className="text-xs tracking-tight text-slate-500 dark:text-slate-400">
                  Text
                </span>
              </label>

              <label className="group flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsLinks ? "bg-blue-600 border-transparent" : "bg-transparent border border-slate-300 dark:border-slate-700"}`}
                >
                  {acceptsLinks && (
                    <span className="text-white text-[10px]">✓</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={acceptsLinks}
                  onChange={(e) => setAcceptsLinks(e.target.checked)}
                  className="hidden"
                />
                <span className="text-xs tracking-tight text-slate-500 dark:text-slate-400">
                  Links
                </span>
              </label>

              {acceptsLinks && (
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Max Links:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxLinks}
                    onChange={(e) => setMaxLinks(e.target.value)}
                    className="w-12 h-7 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 outline-none"
                  />
                </div>
              )}

              <label className="group flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-sm flex items-center justify-center transition-colors ${acceptsFiles ? "bg-blue-600 border-transparent" : "bg-transparent border border-slate-300 dark:border-slate-700"}`}
                >
                  {acceptsFiles && (
                    <span className="text-white text-[10px]">✓</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={acceptsFiles}
                  onChange={(e) => setAcceptsFiles(e.target.checked)}
                  className="hidden"
                />
                <span className="text-xs tracking-tight text-slate-500 dark:text-slate-400">
                  Files
                </span>
              </label>

              {acceptsFiles && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Max Files:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(e.target.value)}
                    className="w-12 h-7 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 outline-none"
                  />
                  <Select value={fileCategory} onValueChange={setFileCategory}>
                    <SelectTrigger className="w-24 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 h-7">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 min-w-[6rem]">
                      <SelectItem
                        value="image"
                        className="text-[10px] font-semibold"
                      >
                        IMAGES
                      </SelectItem>
                      <SelectItem
                        value="video"
                        className="text-[10px] font-semibold"
                      >
                        VIDEOS
                      </SelectItem>
                      <SelectItem
                        value="raw"
                        className="text-[10px] font-semibold"
                      >
                        ANY FILE
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full lg:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-xs font-bold tracking-tight transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editId
              ? isSaving
                ? "Updating..."
                : "Update Task"
              : isSaving
                ? "Creating..."
                : "Create Task"}
          </button>
        </div>
      </motion.form>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex flex-wrap gap-2 pb-4">
          {departments.map((dept) => (
            <button
              key={dept._id}
              onClick={() => setActiveTab(dept._id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all ${
                activeTab === dept._id
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                  : "bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#020617] hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-colors">
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-normal w-16 text-center">
                    Ord
                  </th>
                  <th className="px-6 py-4 font-normal">Title</th>
                  <th className="px-6 py-4 font-normal">Accepts</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200"
              >
                {activeTasks.length === 0 ? (
                  <motion.tr variants={itemVariants}>
                    <td
                      colSpan="4"
                      className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs"
                    >
                      No tasks found for this department
                    </td>
                  </motion.tr>
                ) : (
                  activeTasks.map((task) => (
                    <motion.tr
                      variants={itemVariants}
                      key={task._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <td className="px-6 py-5 text-center text-slate-500 dark:text-slate-400 font-mono text-sm">
                        {task.order}
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                        {task.title}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          {task.submission?.acceptsText && (
                            <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-1 text-[10px]  tracking-widest">
                              TXT
                            </span>
                          )}
                          {task.submission?.acceptsLinks && (
                            <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-1 text-[10px]  tracking-widest">
                              LNK
                            </span>
                          )}
                          {task.submission?.acceptsFiles && (
                            <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-1 text-[10px]  tracking-widest">
                              FILE
                            </span>
                          )}
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
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
            <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
              {activeTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">
                  No tasks found for this department
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div key={task._id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wide text-sm">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full">
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-xs font-normal">
                          {task.order}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mr-2 self-center">
                        Accepts:
                      </span>
                      {task.submission?.acceptsText && (
                        <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-0.5 text-[10px] tracking-widest">
                          TXT
                        </span>
                      )}
                      {task.submission?.acceptsLinks && (
                        <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-0.5 text-[10px] tracking-widest">
                          LNK
                        </span>
                      )}
                      {task.submission?.acceptsFiles && (
                        <span className="bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded px-2 py-0.5 text-[10px] tracking-widest">
                          FILE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-slate-50 dark:border-slate-800/50">
                      <button
                        onClick={() => handleEdit(task)}
                        title="Edit Task"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(task._id)}
                        title="Delete Task"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
