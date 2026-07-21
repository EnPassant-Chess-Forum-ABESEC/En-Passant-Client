import { useState, useEffect } from "react";
import { useApi } from "@/lib/api";

export default function ApplicationsTab() {
  const fetchApi = useApi();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detail View State
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [appDetails, setAppDetails] = useState(null);
  const [appSubmissions, setAppSubmissions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/admin/applications");
      setApplications(res.applications || []);
    } catch (err) {
      alert("Error loading applications: " + err.message);
    }
    setLoading(false);
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      await fetchApi(`/admin/applications/${id}/status`, {
        method: "PATCH",
        body: { status: newStatus }
      });
      // Update local state for fast UI
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      if (selectedAppId === id && appDetails) {
        setAppDetails({ ...appDetails, status: newStatus });
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const viewDetails = async (id) => {
    setSelectedAppId(id);
    setLoadingDetails(true);
    try {
      const res = await fetchApi(`/admin/applications/${id}`);
      if (res.success) {
        setAppDetails(res.application);
        setAppSubmissions(res.submission || []);
      }
    } catch (err) {
      alert("Error loading details: " + err.message);
    }
    setLoadingDetails(false);
  };

  if (loading) return <div className="p-8 text-center text-white/40 uppercase">Loading...</div>;

  if (selectedAppId) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-6">
        <button onClick={() => setSelectedAppId(null)} className="mb-6 text-sm uppercase text-white/50 hover:text-white flex items-center gap-2">
          &larr; Back to List
        </button>
        
        {loadingDetails ? (
          <div className="p-8 text-center text-white/40 uppercase">Loading Application...</div>
        ) : appDetails ? (
          <div>
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold uppercase text-white tracking-widest">{appDetails.userId?.userName || appDetails.userId}</h2>
                <p className="text-white/60 font-mono text-sm mt-1">{appDetails.userId?.collegeEmail}</p>
                <p className="text-white/50 mt-1 uppercase text-xs tracking-wider">
                  Applied for: <span className="text-white font-bold">{appDetails.preferredDepartmentId?.name}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-xs uppercase text-white/50 mr-2 tracking-widest">Status:</span>
                  <select 
                    onChange={(e) => updateApplicationStatus(appDetails._id, e.target.value)}
                    value={appDetails.status}
                    className="bg-[#222] border border-white/20 p-2 text-xs font-bold text-[#9b1a1a] focus:outline-none uppercase"
                  >
                    {["DRAFT", "PAYMENT_PENDING", "ACTIVE", "TASK_SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs uppercase text-white/50 mr-2 tracking-widest">Payment:</span>
                  <span className={`text-xs font-mono font-bold ${appDetails.paymentStatus === 'SUCCESS' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {appDetails.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold uppercase text-white mb-4 tracking-widest">Task Submissions</h3>
              {appSubmissions.length === 0 ? (
                <p className="text-white/40 p-4 bg-white/5 border border-white/10">No submissions found for this application.</p>
              ) : (
                <div className="space-y-6">
                  {appSubmissions.map((sub, index) => (
                    <div key={sub._id} className="p-4 border border-white/10 bg-[#222]">
                      <h4 className="text-[#9b1a1a] font-bold uppercase mb-2">Submission {index + 1}</h4>
                      
                      {sub.text && (
                        <div className="mb-4">
                          <strong className="block text-xs uppercase text-white/50 tracking-widest mb-1">Text Response:</strong>
                          <div className="p-3 bg-[#111] text-sm text-white/80 whitespace-pre-wrap font-mono border border-white/5">{sub.text}</div>
                        </div>
                      )}
                      
                      {sub.links && sub.links.length > 0 && (
                        <div className="mb-4">
                          <strong className="block text-xs uppercase text-white/50 tracking-widest mb-1">Links:</strong>
                          <ul className="list-disc pl-5">
                            {sub.links.map((link, i) => (
                              <li key={i}><a href={link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline break-all">{link}</a></li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {sub.files && sub.files.length > 0 && (
                        <div>
                          <strong className="block text-xs uppercase text-white/50 tracking-widest mb-2">Attached Files:</strong>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sub.files.map((file, i) => (
                              <a key={i} href={file.url} target="_blank" rel="noreferrer" className="block p-3 border border-white/10 hover:border-white/30 transition text-center bg-[#111]">
                                <span className="block text-xs font-mono truncate text-white/80 mb-1">{file.originalName}</span>
                                {file.resourceType === 'image' && (
                                  <img src={file.url} alt={file.originalName} className="w-full h-24 object-cover mb-1 border border-white/5 opacity-80 hover:opacity-100 transition" />
                                )}
                                <span className="block text-[10px] text-white/40 uppercase">{(file.size / 1024).toFixed(1)} KB</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-red-500 uppercase">Failed to load application details.</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#222] text-white/50 text-xs uppercase tracking-widest">
          <tr>
            <th className="p-4 font-normal">App ID</th>
            <th className="p-4 font-normal">User</th>
            <th className="p-4 font-normal">Department</th>
            <th className="p-4 font-normal">Payment</th>
            <th className="p-4 font-normal">Status</th>
            <th className="p-4 font-normal text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-white">
          {applications.length === 0 ? (
            <tr><td colSpan="6" className="p-8 text-center text-white/40 uppercase">No applications found</td></tr>
          ) : (
            applications.map((app) => (
              <tr key={app._id} className="hover:bg-white/5 transition">
                <td className="p-4 font-mono text-xs text-white/50">{app._id}</td>
                <td className="p-4 font-bold">{app.userId?.userName || app.userId}</td>
                <td className="p-4 text-sm">{app.preferredDepartmentId?.name || "Unknown"}</td>
                <td className={`p-4 text-xs font-mono font-bold ${app.paymentStatus === 'SUCCESS' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {app.paymentStatus}
                </td>
                <td className="p-4 font-mono text-xs text-[#9b1a1a] font-bold">{app.status}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => viewDetails(app._id)} className="text-xs uppercase font-bold text-white/70 hover:text-white tracking-widest">Review</button>
                  <select 
                    onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                    value={app.status}
                    className="bg-[#222] border border-white/20 p-1 text-xs text-white focus:outline-none"
                  >
                    {["DRAFT", "PAYMENT_PENDING", "ACTIVE", "TASK_SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
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
