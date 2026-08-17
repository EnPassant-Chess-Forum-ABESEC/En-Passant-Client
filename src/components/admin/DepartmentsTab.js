import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { Edit2, Trash2, Loader2 } from "lucide-react";
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

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/departments");
      setDepartments(res.departments || []);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetchApi(`/admin/departments/${editId}`, {
          method: "PATCH",
          body: { name, code, description },
        });
        toast.success("Department updated successfully!");
      } else {
        await fetchApi("/admin/departments", {
          method: "POST",
          body: { name, code, description },
        });
        toast.success("Department created successfully!");
      }
      setName("");
      setCode("");
      setDescription("");
      setEditId(null);
      loadData();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  const handleEdit = (dept) => {
    setEditId(dept._id);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const executeDelete = async () => {
    if (!deletingId) return;
    try {
      await fetchApi(`/admin/departments/${deletingId}`, { method: "DELETE" });
      toast.success("Department deleted successfully!");
      loadData();
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
        <span>Loading Data...</span>
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
            {editId ? "Edit Department" : "Create Department"}
          </h2>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setCode("");
                setDescription("");
              }}
              className="text-xs tracking-tight text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500 dark:text-slate-400">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Media & Videography"
              className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500 dark:text-slate-400">
              Code
            </label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MEDIA"
              className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500 dark:text-slate-400">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the department's role..."
              className="w-full bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="w-full lg:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-xs font-bold tracking-tight transition-all transform hover:scale-105 shadow-md"
          >
            {editId ? "Update Department" : "Create Department"}
          </button>
        </div>
      </motion.form>

      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-colors"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#020617] text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-normal">Dept ID</th>
                <th className="px-6 py-4 font-normal">Code</th>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Description</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              className="divide-y divide-slate-100 dark:divide-slate-800/50 text-slate-800 dark:text-slate-200"
            >
              {departments.length === 0 && (
                <motion.tr variants={itemVariants}>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs"
                  >
                    No departments found
                  </td>
                </motion.tr>
              )}
              {departments.map((dept) => (
                <motion.tr
                  variants={itemVariants}
                  key={dept._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-sm text-slate-500 dark:text-slate-400">
                    {dept._id}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold tracking-wider">
                    {dept.code}
                  </td>
                  <td className="px-6 py-5 font-bold tracking-wide text-slate-900 dark:text-slate-50">
                    {dept.name}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 dark:text-slate-400 whitespace-normal min-w-[200px] max-w-md">
                    {dept.description}
                  </td>
                  <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleEdit(dept)}
                        title="Edit Department"
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(dept._id)}
                        title="Delete Department"
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
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
              department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
