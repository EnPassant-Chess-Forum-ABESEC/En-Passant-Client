"use client";

import { X, Upload, Link as LinkIcon, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export default function TaskSubmissionModal({ isOpen, onClose, task }) {
  const [isDragging, setIsDragging] = useState(false);
  const [links, setLinks] = useState([""]);
  const [texts, setTexts] = useState([""]);

  // Lock page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const requiresText = task.submission?.acceptsText;
  const requiresLink = task.submission?.acceptsLinks;
  const requiresFiles = task.submission?.acceptsFiles;
  
  const maxLinks = task.submission?.maxLinks || 5;
  const maxTexts = task.submission?.maxTexts || 5;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto overscroll-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity touch-none"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 bg-white/[0.02] shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              Submit Task
            </h2>
            <p className="text-xs text-[#9b1a1a] mt-1 uppercase tracking-[0.2em] font-bold">
              {task.title}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-12 overflow-y-auto max-h-[60vh] hide-scrollbar custom-scrollbar">
          {!requiresText && !requiresLink && !requiresFiles && (
            <div className="text-white/40 text-sm text-center py-8">
              No submission requirements specified for this task.
            </div>
          )}

          {requiresText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                  <FileText className="w-3 h-3 text-[#9b1a1a]" /> Text Submission
                </label>
                {texts.length < maxTexts && (
                  <button 
                    onClick={() => setTexts([...texts, ""])}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#9b1a1a] hover:text-white transition-colors"
                  >
                    + Add Another
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {texts.map((text, i) => (
                  <textarea 
                    key={i}
                    value={text}
                    onChange={(e) => {
                      const newTexts = [...texts];
                      newTexts[i] = e.target.value;
                      setTexts(newTexts);
                    }}
                    placeholder={`Write your response, findings, or code snippets here... (${i + 1}/${maxTexts})`}
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#9b1a1a]/50 resize-none transition-colors text-sm font-light leading-relaxed"
                  />
                ))}
              </div>
            </div>
          )}

          {requiresLink && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                  <LinkIcon className="w-3 h-3 text-[#9b1a1a]" /> Link Submission
                </label>
                {links.length < maxLinks && (
                  <button 
                    onClick={() => setLinks([...links, ""])}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#9b1a1a] hover:text-white transition-colors"
                  >
                    + Add Another Link
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {links.map((link, i) => (
                  <input 
                    key={i}
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[i] = e.target.value;
                      setLinks(newLinks);
                    }}
                    placeholder={`https://github.com/... (${i + 1}/${maxLinks})`}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-[#9b1a1a]/50 transition-colors text-sm font-light"
                  />
                ))}
              </div>
            </div>
          )}

          {requiresFiles && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-[#9b1a1a] pl-3">
                <Upload className="w-3 h-3 text-[#9b1a1a]" /> File Submission
              </label>
              <div 
                className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
                  isDragging 
                    ? "border-[#9b1a1a] bg-[#9b1a1a]/5" 
                    : "border-white/10 hover:border-white/30 bg-black/50 hover:bg-black/30"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white/40" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-white/80 font-light">
                    <span className="text-[#9b1a1a] font-medium hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    Max files: {task.submission?.maxFiles || 1} • {task.submission?.fileCategory || "Any format"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-white/5 bg-black/20 flex justify-end gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 uppercase text-[10px] font-bold tracking-[0.2em] transition-all"
          >
            Cancel
          </button>
          <button 
            className="px-8 py-4 rounded-xl bg-[#9b1a1a] hover:bg-[#cc0000] text-white shadow-[0_0_20px_rgba(155,26,26,0.2)] hover:shadow-[0_0_30px_rgba(155,26,26,0.4)] uppercase text-[10px] font-bold tracking-[0.2em] transition-all"
            onClick={() => alert("UI Preview Mode: The form looks great! API integration will be done later.")}
          >
            Submit Task
          </button>
        </div>
      </div>
    </div>
  );
}
