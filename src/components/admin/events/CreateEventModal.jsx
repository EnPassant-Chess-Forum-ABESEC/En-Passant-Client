"use client";

import CreateEventPanel from "@/components/admin/events/CreateEventPanel";

export default function CreateEventModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <CreateEventPanel
          onClose={onClose}
          onSuccess={(event) => {
            if (onSuccess) onSuccess(event);
            if (onClose) onClose();
          }}
        />
      </div>
    </div>
  );
}
