import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";
import { Edit2, Trash2 } from "lucide-react";
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
      <div className="p-12 text-center text-slate-500 uppercase tracking-widest text-sm">
        Loading Data...
      </div>
    );

  return (
    <div className="space-y-12">
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold  tracking-tight text-slate-800">
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
              className="text-xs tracking-tight text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500">
              Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Media & Videography"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500">
              Code
            </label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MEDIA"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold tracking-normal text-slate-500">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the department's role..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="w-full lg:w-auto bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-full text-xs font-bold tracking-tight transition-all transform hover:scale-105 shadow-md"
          >
            {editId ? "Update Department" : "Create Department"}
          </button>
        </div>
      </form>

      {/* ─── Department List Table ─── */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-normal">Dept ID</th>
                <th className="px-6 py-4 font-normal">Code</th>
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Description</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-800">
              {departments.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-12 text-center text-slate-500 uppercase tracking-widest text-xs"
                  >
                    No departments found
                  </td>
                </tr>
              )}
              {departments.map((dept) => (
                <tr
                  key={dept._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-sm text-slate-500">
                    {dept._id}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-blue-600 font-bold tracking-wider">
                    {dept.code}
                  </td>
                  <td className="px-6 py-5 font-bold tracking-wide">
                    {dept.name}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 whitespace-normal min-w-[200px] max-w-md">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  );
}
