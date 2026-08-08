"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";

export default function TasksPage() {
  const fetchApi = useApi();
  const [application, setApplication] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isRevealed, setIsRevealed] = useState(true);
  const [revealDate, setRevealDate] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

  // Form states per task
  const [textInputs, setTextInputs] = useState({});
  const [linkInputs, setLinkInputs] = useState({});
  const [fileInputs, setFileInputs] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const appData = await fetchApi("/recruitment/my-application").catch(() => null);
      
      if (appData?.success && appData.myApplication) {
        setApplication(appData.myApplication);
        
        // If they paid, they can see tasks
        if (appData.myApplication.paymentStatus === 'SUCCESS') {
          const deptId = appData.myApplication.preferredDepartmentId._id || appData.myApplication.preferredDepartmentId;
          const tasksData = await fetchApi(`/tasks/department?departmentId=${deptId}&year=2026`);
          if (tasksData.tasks) {
            setTasks(tasksData.tasks);
            
            if (tasksData.isRevealed !== undefined) {
              setIsRevealed(tasksData.isRevealed);
            }
            if (tasksData.revealDate) {
              setRevealDate(new Date(tasksData.revealDate));
            }
            
            if (tasksData.isRevealed !== false) {
              // Load submissions for each task
              for (const task of tasksData.tasks) {
                const subData = await fetchApi(`/submissions/${appData.myApplication._id}/${task._id}`).catch(() => null);
                if (subData?.success && subData.submission) {
                  setSubmissions(prev => ({ ...prev, [task._id]: subData.submission }));
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (taskId, e) => {
    setFileInputs(prev => ({ ...prev, [taskId]: e.target.files }));
  };

  const submitTask = async (taskId, e) => {
    e.preventDefault();
    if (!application) return;

    try {
      const formData = new FormData();
      
      if (textInputs[taskId]) {
        formData.append("text", textInputs[taskId]);
      }
      if (linkInputs[taskId]) {
        formData.append("links", linkInputs[taskId]); // Simplified: backend takes string[] but formData append strings it. Backend handles it or we send multiple
      }
      
      const files = fileInputs[taskId];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      const res = await fetchApi(`/submissions/${application._id}/${taskId}`, {
        method: "POST",
        body: formData
        // Don't set Content-Type header for FormData, browser does it automatically with boundary
      });

      if (res.success) {
        alert("Submitted successfully!");
        setSubmissions(prev => ({ ...prev, [taskId]: res.submission }));
      }
    } catch (err) {
      alert("Error submitting: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-8 mt-24">Loading tasks...</div>;
  }

  if (!application) {
    return <div className="p-8 mt-24 text-white/50">You haven't applied yet. Go to /apply.</div>;
  }

  if (application.paymentStatus !== 'SUCCESS') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans text-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-[#ff4444] mb-4">Payment Required</h1>
          <p className="text-white/50 text-sm">You must complete your application payment to view tasks.</p>
        </div>
      </div>
    );
  }

  if (!isRevealed && revealDate) {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <div className="w-20 h-20 bg-[#9b1a1a]/10 rounded-full flex items-center justify-center mb-6 border border-[#9b1a1a]/30">
          <svg className="w-8 h-8 text-[#ff4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-[0.2em] mb-4">Tasks Locked</h1>
        <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed mb-8">
          The tasks for this recruitment cycle will be revealed exactly at:
        </p>
        <CountdownTimer targetDate={revealDate} />
        <p className="text-[#ff4444]/60 text-xs font-bold tracking-[0.3em] uppercase">
          {revealDate.toLocaleString()}
        </p>
      </main>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-8 mt-24 font-sans bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4">Department Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-white/40">No tasks found for your department.</p>
      ) : (
        <div className="space-y-12">
          {tasks.map(task => {
            const sub = submissions[task._id];
            
            return (
              <div key={task._id} className="bg-[#1a1a1a] p-6 border border-white/10 rounded-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold uppercase text-white tracking-wider">{task.title}</h2>
                  {sub && <span className="bg-green-900/30 text-green-400 px-3 py-1 text-xs font-mono uppercase tracking-widest">Submitted</span>}
                </div>
                
                <p className="text-white/80 mb-4">{task.summary}</p>
                
                <div className="mb-6 p-4 bg-white/5 border border-white/10 text-sm text-white/70">
                  <strong className="block text-white mb-2 uppercase tracking-widest">Instructions:</strong>
                  {Array.isArray(task.instructions) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {task.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                    </ul>
                  ) : (
                    <p>{task.instructions}</p>
                  )}
                </div>

                <form onSubmit={(e) => submitTask(task._id, e)} className="space-y-4">
                  {task.submission.acceptsText && (
                    <div>
                      <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Text Answer</label>
                      <textarea
                        value={textInputs[task._id] || (sub?.text || "")}
                        onChange={e => setTextInputs(prev => ({ ...prev, [task._id]: e.target.value }))}
                        className="w-full bg-[#222] border border-white/20 p-3 text-white focus:outline-none focus:border-[#9b1a1a] min-h-[100px]"
                      ></textarea>
                    </div>
                  )}

                  {task.submission.acceptsLinks && (
                    <div>
                      <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">Submission Link (e.g., GitHub, Figma)</label>
                      <input
                        type="url"
                        value={linkInputs[task._id] || (sub?.links?.[0] || "")}
                        onChange={e => setLinkInputs(prev => ({ ...prev, [task._id]: e.target.value }))}
                        className="w-full bg-[#222] border border-white/20 p-3 text-white focus:outline-none focus:border-[#9b1a1a]"
                      />
                    </div>
                  )}

                  {task.submission.acceptsFiles && (
                    <div>
                      <label className="block text-sm text-white/60 uppercase mb-2 tracking-wider">
                        Upload Files (Max: {task.submission.maxFiles}, {task.submission.fileCategory})
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(task._id, e)}
                        className="w-full text-white/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                      />
                    </div>
                  )}

                  <button type="submit" className="bg-[#9b1a1a] text-white uppercase font-bold tracking-widest px-8 py-3 hover:bg-red-800 transition w-full mt-4">
                    Submit Task
                  </button>
                </form>

                {sub?.files && sub.files.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-bold uppercase text-white/50 mb-4 tracking-widest">Uploaded Files</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {sub.files.map(f => (
                        <a key={f.publicId} href={f.url} target="_blank" rel="noreferrer" className="block p-4 border border-white/10 hover:border-white/30 transition text-center">
                          <span className="block text-xs font-mono truncate text-white/80">{f.originalName}</span>
                          <span className="block text-[10px] text-white/40 mt-1 uppercase">{(f.size / 1024).toFixed(1)} KB</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00:00");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="font-mono text-4xl sm:text-5xl tracking-widest font-black text-white mb-6 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(155,26,26,0.1)]">
      {timeLeft || "..."}
      <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-[0.3em] font-sans mt-3 px-2">
        <span>Days</span>
        <span>Hours</span>
        <span>Mins</span>
        <span>Secs</span>
      </div>
    </div>
  );
};
