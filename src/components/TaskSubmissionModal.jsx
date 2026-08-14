"use client";

import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useApi } from "@/lib/api";
import { toast } from "sonner";
import { useLenis } from "lenis/react";
import SpecularButton from "./SpecularButton";

export default function TaskSubmissionModal({ isOpen, onClose, task }) {
  const lenis = useLenis();
  const [isDragging, setIsDragging] = useState(false);
  const [links, setLinks] = useState([""]);
  const [texts, setTexts] = useState([""]);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  const fileInputRef = useRef(null);
  const fetchApi = useApi();

  useEffect(() => {
    if (isOpen) {
      fetchApi("/recruitment/my-application")
        .then((data) => {
          if (data?.myApplication) {
            setApplicationId(data.myApplication._id);
          }
        })
        .catch(console.error);
    } else {
      // Reset state when closed
      setLinks([""]);
      setTexts([""]);
      setFiles([]);
    }
  }, [isOpen, fetchApi]);

  // Lock page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, lenis]);

  if (!isOpen || !task) return null;

  const requiresText = task.submission?.acceptsText;
  const requiresLink = task.submission?.acceptsLinks;
  const requiresFiles = task.submission?.acceptsFiles;

  const maxLinks = task.submission?.maxLinks || 5;
  const maxTexts = task.submission?.maxTexts || 5;
  const maxFiles = task.submission?.maxFiles || 1;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    if (files.length + newFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!applicationId) {
      toast.error("Application not found.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      const filteredTexts = texts.filter((t) => t.trim() !== "");
      if (filteredTexts.length > 0) {
        formData.append("text", filteredTexts.join("\n\n"));
      }

      const filteredLinks = links.filter((l) => l.trim() !== "");
      filteredLinks.forEach((link) => {
        formData.append("links", link);
      });

      files.forEach((file) => {
        formData.append("files", file);
      });

      await fetchApi(`/submissions/${applicationId}/${task._id}`, {
        method: "POST",
        body: formData,
      });

      toast.success("Task submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto overflow-y-auto overscroll-none"
      data-lenis-prevent="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity touch-none"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] shrink-0 relative">
          <div className="pr-10">
            <h2 className="text-2xl md:text-3xl font-pezula font-normal text-white tracking-[0.1em] uppercase">
              Submit Task
            </h2>
            <p className="text-xs font-sans text-white/50 mt-1.5 uppercase tracking-[0.15em] font-medium leading-relaxed">
              {task.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 md:top-7 md:right-7 p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 shrink-0 flex items-center justify-center">
          <div className="text-amber-500/90 text-xs md:text-sm text-center tracking-wide flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
            <p>
              <span className="font-bold uppercase tracking-widest mr-2">
                IMPORTANT:
              </span>
              <span>
                Tasks can only be submitted once and cannot be edited.
              </span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div 
          className="p-6 md:p-8 space-y-12 overflow-y-auto max-h-[60vh] hide-scrollbar custom-scrollbar"
          data-lenis-prevent="true"
        >
          {!requiresText && !requiresLink && !requiresFiles && (
            <div className="text-white/40 text-sm text-center py-8">
              No submission requirements specified for this task.
            </div>
          )}

          {requiresText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/30 pl-3">
                  <FileText className="w-3 h-3 text-white/40" /> Text Submission
                </label>
                {texts.length < maxTexts && (
                  <button
                    onClick={() => setTexts([...texts, ""])}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
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
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-5 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none transition-colors text-sm font-light leading-relaxed"
                  />
                ))}
              </div>
            </div>
          )}

          {requiresLink && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/30 pl-3">
                  <LinkIcon className="w-3 h-3 text-white/40" /> Link Submission
                </label>
                {links.length < maxLinks && (
                  <button
                    onClick={() => setLinks([...links, ""])}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
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
                    className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors text-sm font-light"
                  />
                ))}
              </div>
            </div>
          )}

          {requiresFiles && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border-l-2 border-white/30 pl-3">
                <Upload className="w-3 h-3 text-white/40" /> File Submission
              </label>
              <div
                className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer ${
                  isDragging
                    ? "border-white bg-white/5"
                    : "border-white/10 hover:border-white/30 bg-black/50 hover:bg-black/30"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  multiple={maxFiles > 1}
                  onChange={handleFileSelect}
                />
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white/40" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-white/80 font-light">
                    <span className="text-white font-medium hover:underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    Max files: {maxFiles} •{" "}
                    {task.submission?.fileCategory || "Any format"}
                  </p>
                </div>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg"
                    >
                      <span className="text-sm text-white/80 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(i)}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-white/5 bg-black/20 flex justify-end gap-4 shrink-0">
          <SpecularButton
            onClick={onClose}
            size="sm"
            className="!px-8 !py-4 uppercase !text-[10px] font-bold tracking-[0.2em]"
            lineColor="#555555"
            baseColor="#222222"
            textColor="rgba(255, 255, 255, 0.7)"
            radius={12}
          >
            Cancel
          </SpecularButton>
          <SpecularButton
            onClick={handleSubmit}
            disabled={isSubmitting || !applicationId}
            size="sm"
            autoAnimate={true}
            className="!px-8 !py-4 uppercase !text-[10px] font-bold tracking-[0.2em] min-w-[160px]"
            lineColor="#9b1a1a"
            baseColor="#222222"
            textColor="#ffffff"
            radius={12}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}
